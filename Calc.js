// Store definition

function createStore(rootReducer, defaultState) {
   if (typeof rootReducer !== `function`)
     throw new Error(`Reducer must be a function.`);
 
   let state = defaultState || null;
   let listeners = [];
 
   return {
     getState() {
       return state;
     },
     dispatch(action) {
       if (typeof action !== `object`)
         throw new Error(`Action must be an object.`);
       if (!action.hasOwnProperty(`type`))
         throw new Error(`Action object must contain type.`);
 
       state = rootReducer(state, action);
 
       if (listeners.length !== 0) {
         listeners.forEach(listener => listener(state));
       }
     },
     subscribe(listener) {
       if (typeof listener !== "function")
         throw new Error("Listener must be a function.");
       listeners.push(listener);
       return function unsubscribe() {
         if (listeners.indexOf(listener) !== -1) {
           listeners.splice(listeners.indexOf(listener), 1);
         }
       };
     }
   };
 }
 
 // Reducer
 
 const defaultState = {
   currentInput: "",
   leftPart: "",
   rightPartExpected: false,
   operator: ""
 };
 
 function rootReducer(state, action) {
   switch (action.type) {
     case "AC":
       return defaultState;
     case "ADD_TO_CURRENT_INPUT":
       return Object.assign({}, state, {
         currentInput:
           state.currentInput && !state.rightPartExpected
             ? state.currentInput + action.char
             : action.char,
         rightPartExpected: false
       });
     case "CALCULATE":
       return Object.assign(
         {},
         {
           leftPart: "",
           rightPartExpected: false,
           currentInput: action.result,
           operator: ""
         }
       );
     case "ADD_OPERATOR":
       return Object.assign({}, state, {
         operator: action.operator,
         leftPart: state.currentInput,
         rightPartExpected: true
       });
     case "TOGGLE_NEGATIVE":
       return Object.assign({}, state, {
         currentInput:
           state.currentInput.indexOf("-") !== -1
             ? state.currentInput.slice(1)
             : "-" + state.currentInput
       });
     default:
       return state;
   }
 }
 
 const store = createStore(rootReducer, defaultState);
 
 const buttons = document.querySelector(".buttons");
 
 // evaluate math expression and return string
 function evalExpr(leftPart, operator, rightPart) {
   const expr = leftPart + operator + rightPart;
   const result = String(eval(expr));
   return result;
 }
 
 // convert Unicode to operator
 function charToOperator(char) {
   switch (char) {
     case "\u00f7":
       return "/";
     case "\u00d7":
       return "*";
     case "\u2212":
       return "-";
     case "\u002b":
       return "+";
     case "\u0025":
       return "%";
     default:
       throw new Error("Unknown operator");
   }
 }
 
 // Event listener and logic
 
 buttons.addEventListener("click", evt => {
   const val = evt.target.textContent;
   const state = store.getState();
 
   // a number
   if (/\d/.test(val)) {
     store.dispatch({ type: "ADD_TO_CURRENT_INPUT", char: val });
 
     // decimal point
   } else if (val === ".") {
     const currentInput = state.currentInput;
     if (currentInput.length === 0 || currentInput.indexOf(".") !== -1) return;
     store.dispatch({ type: "ADD_TO_CURRENT_INPUT", char: val });
 
     // AC
   } else if (val === "ac") {
     if (!state.currentInput) return;
     store.dispatch({ type: "AC" });
 
     // operator
   } else if (/[\u00f7\u00d7\u2212\u002b\u0025]/.test(val)) {
     if (!state.currentInput || state.rightPartExpected) return;
     const operator = charToOperator(val);
 
     if (!state.leftPart) {
       store.dispatch({ type: "ADD_OPERATOR", operator: operator });
     } else {
       store.dispatch({
         type: "CALCULATE",
         result: evalExpr(state.leftPart, state.operator, state.currentInput)
       });
       store.dispatch({ type: "ADD_OPERATOR", operator: operator });
     }
 
     // plus-minus
   } else if (/\u00B1/.test(val)) {
     if (!state.currentInput) return;
     store.dispatch({ type: "TOGGLE_NEGATIVE" });
 
     // equal
   } else if (/\u003d/.test(val)) {
     if (!state.currentInput || !state.leftPart) return;
     const result = evalExpr(state.leftPart, state.operator, state.currentInput);
     store.dispatch({ type: "CALCULATE", result: result });
   }
 });
 
 // View
 
 const resultElem = document.querySelector(".result");
 
 store.subscribe(state => {
   console.log(store.getState());
   resultElem.innerHTML = state.currentInput || 0;
 });
 
