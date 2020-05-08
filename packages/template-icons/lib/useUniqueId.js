Object.defineProperty(exports,"__esModule",{value:!0}),exports.useUniqueId=void 0;const _react=require("react");

 let counter=0; const useUniqueId=function(){return(0,_react.useMemo)(function(){return++counter},[])};

exports.useUniqueId=useUniqueId;