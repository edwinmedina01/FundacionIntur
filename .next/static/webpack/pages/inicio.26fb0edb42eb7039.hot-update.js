"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/inicio",{

/***/ "./src/components/Layout.jsx":
/*!***********************************!*\
  !*** ./src/components/Layout.jsx ***!
  \***********************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _swc_helpers_async_to_generator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @swc/helpers/_/_async_to_generator */ \"./node_modules/@swc/helpers/esm/_async_to_generator.js\");\n/* harmony import */ var _swc_helpers_sliced_to_array__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @swc/helpers/_/_sliced_to_array */ \"./node_modules/@swc/helpers/esm/_sliced_to_array.js\");\n/* harmony import */ var _swc_helpers_ts_generator__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @swc/helpers/_/_ts_generator */ \"./node_modules/@swc/helpers/esm/_ts_generator.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/link */ \"./node_modules/next/link.js\");\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/router */ \"./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! axios */ \"./node_modules/axios/index.js\");\n/* harmony import */ var _context_AuthContext__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../context/AuthContext */ \"./src/context/AuthContext.js\");\n\n\n\nvar _this = undefined;\n\nvar _s = $RefreshSig$();\n\n\n\n\n //usuario\nvar Layout = function(param) {\n    var children = param.children;\n    _s();\n    var user = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(_context_AuthContext__WEBPACK_IMPORTED_MODULE_4__[\"default\"]).user; // usuario desde el contexto de autenticación\n    var _useState = (0,_swc_helpers_sliced_to_array__WEBPACK_IMPORTED_MODULE_5__._)((0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false), 2), menuOpen = _useState[0], setMenuOpen = _useState[1];\n    var _useState1 = (0,_swc_helpers_sliced_to_array__WEBPACK_IMPORTED_MODULE_5__._)((0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false), 2), dropdownOpen = _useState1[0], setDropdownOpen = _useState1[1];\n    var router = (0,next_router__WEBPACK_IMPORTED_MODULE_3__.useRouter)();\n    var toggleMenu = function() {\n        setMenuOpen(!menuOpen);\n    };\n    var toggleDropdown = function() {\n        setDropdownOpen(!dropdownOpen);\n    };\n    var handleLogout = function() {\n        var _ref = (0,_swc_helpers_async_to_generator__WEBPACK_IMPORTED_MODULE_6__._)(function() {\n            var error;\n            return (0,_swc_helpers_ts_generator__WEBPACK_IMPORTED_MODULE_7__._)(this, function(_state) {\n                switch(_state.label){\n                    case 0:\n                        _state.trys.push([\n                            0,\n                            2,\n                            ,\n                            3\n                        ]);\n                        return [\n                            4,\n                            axios__WEBPACK_IMPORTED_MODULE_8__[\"default\"].post(\"/api/logout\")\n                        ];\n                    case 1:\n                        _state.sent();\n                        router.push(\"/\");\n                        return [\n                            3,\n                            3\n                        ];\n                    case 2:\n                        error = _state.sent();\n                        console.error(\"Error al cerrar sesi\\xf3n:\", error);\n                        return [\n                            3,\n                            3\n                        ];\n                    case 3:\n                        return [\n                            2\n                        ];\n                }\n            });\n        });\n        return function handleLogout() {\n            return _ref.apply(this, arguments);\n        };\n    }();\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"nav\", {\n                className: \"flex justify-between items-center bg-blue-700 p-4 shadow-md\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"img\", {\n                        src: \"/img/intur.png\",\n                        alt: \"logo\"\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n                        lineNumber: 34,\n                        columnNumber: 17\n                    }, _this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"ul\", {\n                        className: \"flex space-x-8 text-white mx-auto\",\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"li\", {\n                                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {\n                                    href: \"/inicio\",\n                                    className: \"hover:text-blue-300 transition duration-300\",\n                                    children: \"Inicio\"\n                                }, void 0, false, {\n                                    fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n                                    lineNumber: 40,\n                                    columnNumber: 25\n                                }, _this)\n                            }, void 0, false, {\n                                fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n                                lineNumber: 39,\n                                columnNumber: 21\n                            }, _this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"li\", {\n                                className: \"relative\",\n                                children: [\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                                        onClick: toggleDropdown,\n                                        className: \"text-white focus:outline-none hover:text-blue-300 transition duration-300\",\n                                        children: [\n                                            \"Mantenimiento \",\n                                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                                className: \"ml-2\",\n                                                children: \"▼\"\n                                            }, void 0, false, {\n                                                fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n                                                lineNumber: 48,\n                                                columnNumber: 43\n                                            }, _this)\n                                        ]\n                                    }, void 0, true, {\n                                        fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n                                        lineNumber: 44,\n                                        columnNumber: 25\n                                    }, _this),\n                                    dropdownOpen && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                        className: \"absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10\",\n                                        children: [\n                                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {\n                                                href: \"/roles\",\n                                                className: \"block px-4 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-600 transition duration-300\",\n                                                children: \"Roles\"\n                                            }, void 0, false, {\n                                                fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n                                                lineNumber: 52,\n                                                columnNumber: 33\n                                            }, _this),\n                                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {\n                                                href: \"/usuarios\",\n                                                className: \"block px-4 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-600 transition duration-300\",\n                                                children: \"Usuarios\"\n                                            }, void 0, false, {\n                                                fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n                                                lineNumber: 55,\n                                                columnNumber: 33\n                                            }, _this)\n                                        ]\n                                    }, void 0, true, {\n                                        fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n                                        lineNumber: 51,\n                                        columnNumber: 29\n                                    }, _this)\n                                ]\n                            }, void 0, true, {\n                                fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n                                lineNumber: 43,\n                                columnNumber: 21\n                            }, _this)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n                        lineNumber: 38,\n                        columnNumber: 17\n                    }, _this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"relative\",\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                                onClick: toggleMenu,\n                                className: \"text-white focus:outline-none hover:text-blue-300 transition duration-300\",\n                                children: [\n                                    (user === null || user === void 0 ? void 0 : user.nombre) || \"Usuario\",\n                                    \" \",\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                        className: \"ml-2\",\n                                        children: \"▼\"\n                                    }, void 0, false, {\n                                        fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n                                        lineNumber: 68,\n                                        columnNumber: 53\n                                    }, _this)\n                                ]\n                            }, void 0, true, {\n                                fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n                                lineNumber: 63,\n                                columnNumber: 21\n                            }, _this),\n                            menuOpen && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                className: \"absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10\",\n                                children: [\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {\n                                        href: \"/perfil\",\n                                        className: \"block px-4 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-600 transition duration-300\",\n                                        children: \"Perfil\"\n                                    }, void 0, false, {\n                                        fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n                                        lineNumber: 72,\n                                        columnNumber: 29\n                                    }, _this),\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                                        onClick: handleLogout,\n                                        className: \"block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-600 transition duration-300\",\n                                        children: \"Cerrar Sesi\\xf3n\"\n                                    }, void 0, false, {\n                                        fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n                                        lineNumber: 75,\n                                        columnNumber: 29\n                                    }, _this)\n                                ]\n                            }, void 0, true, {\n                                fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n                                lineNumber: 71,\n                                columnNumber: 25\n                            }, _this)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n                        lineNumber: 62,\n                        columnNumber: 17\n                    }, _this)\n                ]\n            }, void 0, true, {\n                fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n                lineNumber: 33,\n                columnNumber: 13\n            }, _this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"main\", {\n                children: children\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n                lineNumber: 85,\n                columnNumber: 13\n            }, _this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"footer\", {\n                className: \"bg-gray-200 p-4 text-center\",\n                children: \"\\xa9 2024 Tu Empresa\"\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n                lineNumber: 86,\n                columnNumber: 13\n            }, _this)\n        ]\n    }, void 0, true, {\n        fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n        lineNumber: 32,\n        columnNumber: 9\n    }, _this);\n};\n_s(Layout, \"MOcjOEgM64ouXBiwQra0zOGGp9Y=\", false, function() {\n    return [\n        next_router__WEBPACK_IMPORTED_MODULE_3__.useRouter\n    ];\n});\n_c = Layout;\n/* harmony default export */ __webpack_exports__[\"default\"] = (Layout);\nvar _c;\n$RefreshReg$(_c, \"Layout\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tcG9uZW50cy9MYXlvdXQuanN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQTZDO0FBQ2hCO0FBQ1c7QUFDZDtBQUN1QixDQUFDLFNBQVM7QUFHM0QsSUFBTU0sU0FBUztRQUFHQyxpQkFBQUE7O0lBQ2QsSUFBTSxPQUFXUCxpREFBVUEsQ0FBQ0ssNERBQVdBLEVBQS9CRyxNQUFrQyw2Q0FBNkM7SUFDdkYsSUFBZ0NQLFlBQUFBLCtEQUFBQSxDQUFBQSwrQ0FBUUEsQ0FBQyxZQUFsQ1EsV0FBeUJSLGNBQWZTLGNBQWVUO0lBQ2hDLElBQXdDQSxhQUFBQSwrREFBQUEsQ0FBQUEsK0NBQVFBLENBQUMsWUFBMUNVLGVBQWlDVixlQUFuQlcsa0JBQW1CWDtJQUN4QyxJQUFNWSxTQUFTVixzREFBU0E7SUFFeEIsSUFBTVcsYUFBYTtRQUNmSixZQUFZLENBQUNEO0lBQ2pCO0lBRUEsSUFBTU0saUJBQWlCO1FBQ25CSCxnQkFBZ0IsQ0FBQ0Q7SUFDckI7SUFFQSxJQUFNSzttQkFBZTtnQkFJUkM7Ozs7Ozs7Ozs7d0JBRkw7OzRCQUFNYixrREFBVSxDQUFDOzs7d0JBQWpCO3dCQUNBUyxPQUFPTSxJQUFJLENBQUM7Ozs7Ozt3QkFDUEY7d0JBQ0xHLFFBQVFILEtBQUssQ0FBQyw4QkFBMkJBOzs7Ozs7Ozs7OztRQUVqRDt3QkFQTUQ7Ozs7SUFTTixxQkFDSSw4REFBQ0s7OzBCQUNHLDhEQUFDQztnQkFBSUMsV0FBVTs7a0NBQ1gsOERBQUNDO3dCQUNHQyxLQUFJO3dCQUNKQyxLQUFJOzs7Ozs7a0NBRVIsOERBQUNDO3dCQUFHSixXQUFVOzswQ0FDViw4REFBQ0s7MENBQ0csNEVBQUMxQixrREFBSUE7b0NBQUMyQixNQUFLO29DQUFVTixXQUFVOzhDQUE4Qzs7Ozs7Ozs7Ozs7MENBR2pGLDhEQUFDSztnQ0FBR0wsV0FBVTs7a0RBQ1YsOERBQUNPO3dDQUNHQyxTQUFTaEI7d0NBQ1RRLFdBQVU7OzRDQUNiOzBEQUNpQiw4REFBQ1M7Z0RBQUtULFdBQVU7MERBQU87Ozs7Ozs7Ozs7OztvQ0FFeENaLDhCQUNHLDhEQUFDVTt3Q0FBSUUsV0FBVTs7MERBQ1gsOERBQUNyQixrREFBSUE7Z0RBQUMyQixNQUFLO2dEQUFTTixXQUFVOzBEQUE4Rjs7Ozs7OzBEQUc1SCw4REFBQ3JCLGtEQUFJQTtnREFBQzJCLE1BQUs7Z0RBQVlOLFdBQVU7MERBQThGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7a0NBTy9JLDhEQUFDRjt3QkFBSUUsV0FBVTs7MENBQ1gsOERBQUNPO2dDQUNHQyxTQUFTakI7Z0NBQ1RTLFdBQVU7O29DQUdUZixDQUFBQSxpQkFBQUEsMkJBQUFBLEtBQU15QixNQUFNLEtBQUk7b0NBQVU7a0RBQUMsOERBQUNEO3dDQUFLVCxXQUFVO2tEQUFPOzs7Ozs7Ozs7Ozs7NEJBRXREZCwwQkFDRyw4REFBQ1k7Z0NBQUlFLFdBQVU7O2tEQUNYLDhEQUFDckIsa0RBQUlBO3dDQUFDMkIsTUFBSzt3Q0FBVU4sV0FBVTtrREFBOEY7Ozs7OztrREFHN0gsOERBQUNPO3dDQUNHQyxTQUFTZjt3Q0FDVE8sV0FBVTtrREFDYjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzBCQU9qQiw4REFBQ1c7MEJBQU0zQjs7Ozs7OzBCQUNQLDhEQUFDNEI7Z0JBQU9aLFdBQVU7MEJBQThCOzs7Ozs7Ozs7Ozs7QUFHNUQ7R0FqRk1qQjs7UUFJYUgsa0RBQVNBOzs7S0FKdEJHO0FBbUZOLCtEQUFlQSxNQUFNQSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL3NyYy9jb21wb25lbnRzL0xheW91dC5qc3g/NDFkMSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IExpbmsgZnJvbSAnbmV4dC9saW5rJztcclxuaW1wb3J0IHsgdXNlUm91dGVyIH0gZnJvbSAnbmV4dC9yb3V0ZXInO1xyXG5pbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xyXG5pbXBvcnQgQXV0aENvbnRleHQgZnJvbSAnLi4vY29udGV4dC9BdXRoQ29udGV4dCc7IC8vdXN1YXJpb1xyXG5cclxuXHJcbmNvbnN0IExheW91dCA9ICh7IGNoaWxkcmVuIH0pID0+IHtcclxuICAgIGNvbnN0IHsgdXNlciB9ID0gdXNlQ29udGV4dChBdXRoQ29udGV4dCk7IC8vIHVzdWFyaW8gZGVzZGUgZWwgY29udGV4dG8gZGUgYXV0ZW50aWNhY2nDs25cclxuICAgIGNvbnN0IFttZW51T3Blbiwgc2V0TWVudU9wZW5dID0gdXNlU3RhdGUoZmFsc2UpO1xyXG4gICAgY29uc3QgW2Ryb3Bkb3duT3Blbiwgc2V0RHJvcGRvd25PcGVuXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuICAgIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpO1xyXG5cclxuICAgIGNvbnN0IHRvZ2dsZU1lbnUgPSAoKSA9PiB7XHJcbiAgICAgICAgc2V0TWVudU9wZW4oIW1lbnVPcGVuKTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgdG9nZ2xlRHJvcGRvd24gPSAoKSA9PiB7XHJcbiAgICAgICAgc2V0RHJvcGRvd25PcGVuKCFkcm9wZG93bk9wZW4pO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBoYW5kbGVMb2dvdXQgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgYXdhaXQgYXhpb3MucG9zdCgnL2FwaS9sb2dvdXQnKTtcclxuICAgICAgICAgICAgcm91dGVyLnB1c2goJy8nKTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBhbCBjZXJyYXIgc2VzacOzbjonLCBlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxuYXYgY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWJldHdlZW4gaXRlbXMtY2VudGVyIGJnLWJsdWUtNzAwIHAtNCBzaGFkb3ctbWRcIj5cclxuICAgICAgICAgICAgICAgIDxpbWcgXHJcbiAgICAgICAgICAgICAgICAgICAgc3JjPVwiL2ltZy9pbnR1ci5wbmdcIiBcclxuICAgICAgICAgICAgICAgICAgICBhbHQ9XCJsb2dvXCIgXHJcbiAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImZsZXggc3BhY2UteC04IHRleHQtd2hpdGUgbXgtYXV0b1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPExpbmsgaHJlZj1cIi9pbmljaW9cIiBjbGFzc05hbWU9XCJob3Zlcjp0ZXh0LWJsdWUtMzAwIHRyYW5zaXRpb24gZHVyYXRpb24tMzAwXCI+SW5pY2lvPC9MaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJyZWxhdGl2ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0b2dnbGVEcm9wZG93bn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQtd2hpdGUgZm9jdXM6b3V0bGluZS1ub25lIGhvdmVyOnRleHQtYmx1ZS0zMDAgdHJhbnNpdGlvbiBkdXJhdGlvbi0zMDBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYW50ZW5pbWllbnRvIDxzcGFuIGNsYXNzTmFtZT1cIm1sLTJcIj7ilrw8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7ZHJvcGRvd25PcGVuICYmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgcmlnaHQtMCBtdC0yIHctNDggYmctd2hpdGUgcm91bmRlZC1tZCBzaGFkb3ctbGcgcHktMiB6LTEwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPExpbmsgaHJlZj1cIi9yb2xlc1wiIGNsYXNzTmFtZT1cImJsb2NrIHB4LTQgcHktMiB0ZXh0LWdyYXktODAwIGhvdmVyOmJnLWJsdWUtMTAwIGhvdmVyOnRleHQtYmx1ZS02MDAgdHJhbnNpdGlvbiBkdXJhdGlvbi0zMDBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUm9sZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0xpbms+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPExpbmsgaHJlZj1cIi91c3Vhcmlvc1wiIGNsYXNzTmFtZT1cImJsb2NrIHB4LTQgcHktMiB0ZXh0LWdyYXktODAwIGhvdmVyOmJnLWJsdWUtMTAwIGhvdmVyOnRleHQtYmx1ZS02MDAgdHJhbnNpdGlvbiBkdXJhdGlvbi0zMDBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVXN1YXJpb3NcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0xpbms+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RvZ2dsZU1lbnV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQtd2hpdGUgZm9jdXM6b3V0bGluZS1ub25lIGhvdmVyOnRleHQtYmx1ZS0zMDAgdHJhbnNpdGlvbiBkdXJhdGlvbi0zMDBcIlxyXG4gICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgey8qIE1vc3RyYXIgZWwgbm9tYnJlIGRlbCB1c3VhcmlvLCBvICdVc3VhcmlvJyBzaSBubyBlc3TDoSBsb2d1ZWFkbyAqL31cclxuICAgICAgICAgICAgICAgICAgICAgICAge3VzZXI/Lm5vbWJyZSB8fCAnVXN1YXJpbyd9IDxzcGFuIGNsYXNzTmFtZT1cIm1sLTJcIj7ilrw8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAge21lbnVPcGVuICYmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSByaWdodC0wIG10LTIgdy00OCBiZy13aGl0ZSByb3VuZGVkLW1kIHNoYWRvdy1sZyBweS0yIHotMTBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxMaW5rIGhyZWY9XCIvcGVyZmlsXCIgY2xhc3NOYW1lPVwiYmxvY2sgcHgtNCBweS0yIHRleHQtZ3JheS04MDAgaG92ZXI6YmctYmx1ZS0xMDAgaG92ZXI6dGV4dC1ibHVlLTYwMCB0cmFuc2l0aW9uIGR1cmF0aW9uLTMwMFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBlcmZpbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9MaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZUxvZ291dH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJibG9jayB3LWZ1bGwgdGV4dC1sZWZ0IHB4LTQgcHktMiB0ZXh0LWdyYXktODAwIGhvdmVyOmJnLWJsdWUtMTAwIGhvdmVyOnRleHQtYmx1ZS02MDAgdHJhbnNpdGlvbiBkdXJhdGlvbi0zMDBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENlcnJhciBTZXNpw7NuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L25hdj5cclxuICAgICAgICAgICAgPG1haW4+e2NoaWxkcmVufTwvbWFpbj5cclxuICAgICAgICAgICAgPGZvb3RlciBjbGFzc05hbWU9XCJiZy1ncmF5LTIwMCBwLTQgdGV4dC1jZW50ZXJcIj7CqSAyMDI0IFR1IEVtcHJlc2E8L2Zvb3Rlcj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBMYXlvdXQ7XHJcbiJdLCJuYW1lcyI6WyJ1c2VDb250ZXh0IiwidXNlU3RhdGUiLCJMaW5rIiwidXNlUm91dGVyIiwiYXhpb3MiLCJBdXRoQ29udGV4dCIsIkxheW91dCIsImNoaWxkcmVuIiwidXNlciIsIm1lbnVPcGVuIiwic2V0TWVudU9wZW4iLCJkcm9wZG93bk9wZW4iLCJzZXREcm9wZG93bk9wZW4iLCJyb3V0ZXIiLCJ0b2dnbGVNZW51IiwidG9nZ2xlRHJvcGRvd24iLCJoYW5kbGVMb2dvdXQiLCJlcnJvciIsInBvc3QiLCJwdXNoIiwiY29uc29sZSIsImRpdiIsIm5hdiIsImNsYXNzTmFtZSIsImltZyIsInNyYyIsImFsdCIsInVsIiwibGkiLCJocmVmIiwiYnV0dG9uIiwib25DbGljayIsInNwYW4iLCJub21icmUiLCJtYWluIiwiZm9vdGVyIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/components/Layout.jsx\n"));

/***/ })

});