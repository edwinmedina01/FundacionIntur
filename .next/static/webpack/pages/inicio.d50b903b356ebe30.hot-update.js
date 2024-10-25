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

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _swc_helpers_async_to_generator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @swc/helpers/_/_async_to_generator */ \"./node_modules/@swc/helpers/esm/_async_to_generator.js\");\n/* harmony import */ var _swc_helpers_sliced_to_array__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @swc/helpers/_/_sliced_to_array */ \"./node_modules/@swc/helpers/esm/_sliced_to_array.js\");\n/* harmony import */ var _swc_helpers_ts_generator__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @swc/helpers/_/_ts_generator */ \"./node_modules/@swc/helpers/esm/_ts_generator.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/link */ \"./node_modules/next/link.js\");\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/router */ \"./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! axios */ \"./node_modules/axios/index.js\");\n/* harmony import */ var _context_AuthContext__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../context/AuthContext */ \"./src/context/AuthContext.js\");\n\n\n\nvar _this = undefined;\n\nvar _s = $RefreshSig$();\n\n\n\n\n //usuario\nvar Layout = function(param) {\n    var children = param.children;\n    _s();\n    var user = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(_context_AuthContext__WEBPACK_IMPORTED_MODULE_4__[\"default\"]).user; // usuario desde el contexto de autenticación\n    var _useState = (0,_swc_helpers_sliced_to_array__WEBPACK_IMPORTED_MODULE_5__._)((0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false), 2), menuOpen = _useState[0], setMenuOpen = _useState[1];\n    var _useState1 = (0,_swc_helpers_sliced_to_array__WEBPACK_IMPORTED_MODULE_5__._)((0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false), 2), dropdownOpen = _useState1[0], setDropdownOpen = _useState1[1];\n    var router = (0,next_router__WEBPACK_IMPORTED_MODULE_3__.useRouter)();\n    var _useState2 = (0,_swc_helpers_sliced_to_array__WEBPACK_IMPORTED_MODULE_5__._)((0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(\"\"), 2), userName = _useState2[0], setUserName = _useState2[1];\n    var toggleMenu = function() {\n        setMenuOpen(!menuOpen);\n    };\n    var token = localStorage.getItem(\"token\");\n    if (token) {\n        var decoded = jwt.decode(token);\n        if (decoded) {\n            setUserName(decoded.nombre); // Asumiendo que el nombre se guarda en el token\n        }\n    }\n    var toggleDropdown = function() {\n        setDropdownOpen(!dropdownOpen);\n    };\n    var handleLogout = function() {\n        var _ref = (0,_swc_helpers_async_to_generator__WEBPACK_IMPORTED_MODULE_6__._)(function() {\n            var error;\n            return (0,_swc_helpers_ts_generator__WEBPACK_IMPORTED_MODULE_7__._)(this, function(_state) {\n                switch(_state.label){\n                    case 0:\n                        _state.trys.push([\n                            0,\n                            2,\n                            ,\n                            3\n                        ]);\n                        return [\n                            4,\n                            axios__WEBPACK_IMPORTED_MODULE_8__[\"default\"].post(\"/api/logout\")\n                        ];\n                    case 1:\n                        _state.sent();\n                        router.push(\"/\");\n                        return [\n                            3,\n                            3\n                        ];\n                    case 2:\n                        error = _state.sent();\n                        console.error(\"Error al cerrar sesi\\xf3n:\", error);\n                        return [\n                            3,\n                            3\n                        ];\n                    case 3:\n                        return [\n                            2\n                        ];\n                }\n            });\n        });\n        return function handleLogout() {\n            return _ref.apply(this, arguments);\n        };\n    }();\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"nav\", {\n                className: \"flex justify-between items-center bg-blue-700 p-4 shadow-md\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"img\", {\n                        src: \"/img/intur.png\",\n                        alt: \"logo\"\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n                        lineNumber: 41,\n                        columnNumber: 17\n                    }, _this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"ul\", {\n                        className: \"flex space-x-8 text-white mx-auto\",\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"li\", {\n                                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {\n                                    href: \"/inicio\",\n                                    className: \"hover:text-blue-300 transition duration-300\",\n                                    children: \"Inicio\"\n                                }, void 0, false, {\n                                    fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n                                    lineNumber: 47,\n                                    columnNumber: 25\n                                }, _this)\n                            }, void 0, false, {\n                                fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n                                lineNumber: 46,\n                                columnNumber: 21\n                            }, _this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"li\", {\n                                className: \"relative\",\n                                children: [\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                                        onClick: toggleDropdown,\n                                        className: \"text-white focus:outline-none hover:text-blue-300 transition duration-300\",\n                                        children: [\n                                            \"Mantenimiento \",\n                                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                                className: \"ml-2\",\n                                                children: \"▼\"\n                                            }, void 0, false, {\n                                                fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n                                                lineNumber: 55,\n                                                columnNumber: 43\n                                            }, _this)\n                                        ]\n                                    }, void 0, true, {\n                                        fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n                                        lineNumber: 51,\n                                        columnNumber: 25\n                                    }, _this),\n                                    dropdownOpen && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                        className: \"absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10\",\n                                        children: [\n                                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {\n                                                href: \"/roles\",\n                                                className: \"block px-4 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-600 transition duration-300\",\n                                                children: \"Roles\"\n                                            }, void 0, false, {\n                                                fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n                                                lineNumber: 59,\n                                                columnNumber: 33\n                                            }, _this),\n                                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {\n                                                href: \"/usuarios\",\n                                                className: \"block px-4 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-600 transition duration-300\",\n                                                children: \"Usuarios\"\n                                            }, void 0, false, {\n                                                fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n                                                lineNumber: 62,\n                                                columnNumber: 33\n                                            }, _this)\n                                        ]\n                                    }, void 0, true, {\n                                        fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n                                        lineNumber: 58,\n                                        columnNumber: 29\n                                    }, _this)\n                                ]\n                            }, void 0, true, {\n                                fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n                                lineNumber: 50,\n                                columnNumber: 21\n                            }, _this)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n                        lineNumber: 45,\n                        columnNumber: 17\n                    }, _this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"relative\",\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                                onClick: toggleMenu,\n                                className: \"text-white focus:outline-none hover:text-blue-300 transition duration-300\",\n                                children: [\n                                    userName || \"Usuario\",\n                                    \" \",\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                        className: \"ml-2\",\n                                        children: \"▼\"\n                                    }, void 0, false, {\n                                        fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n                                        lineNumber: 75,\n                                        columnNumber: 49\n                                    }, _this)\n                                ]\n                            }, void 0, true, {\n                                fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n                                lineNumber: 70,\n                                columnNumber: 21\n                            }, _this),\n                            menuOpen && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                className: \"absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10\",\n                                children: [\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {\n                                        href: \"/perfil\",\n                                        className: \"block px-4 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-600 transition duration-300\",\n                                        children: \"Perfil\"\n                                    }, void 0, false, {\n                                        fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n                                        lineNumber: 79,\n                                        columnNumber: 29\n                                    }, _this),\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                                        onClick: handleLogout,\n                                        className: \"block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-600 transition duration-300\",\n                                        children: \"Cerrar Sesi\\xf3n\"\n                                    }, void 0, false, {\n                                        fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n                                        lineNumber: 82,\n                                        columnNumber: 29\n                                    }, _this)\n                                ]\n                            }, void 0, true, {\n                                fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n                                lineNumber: 78,\n                                columnNumber: 25\n                            }, _this)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n                        lineNumber: 69,\n                        columnNumber: 17\n                    }, _this)\n                ]\n            }, void 0, true, {\n                fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n                lineNumber: 40,\n                columnNumber: 13\n            }, _this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"main\", {\n                children: children\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n                lineNumber: 92,\n                columnNumber: 13\n            }, _this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"footer\", {\n                className: \"bg-gray-200 p-4 text-center\",\n                children: \"\\xa9 2024 Tu Empresa\"\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n                lineNumber: 93,\n                columnNumber: 13\n            }, _this)\n        ]\n    }, void 0, true, {\n        fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\components\\\\Layout.jsx\",\n        lineNumber: 39,\n        columnNumber: 9\n    }, _this);\n};\n_s(Layout, \"5v2z9B3fT6sefuAjBDVMBxWWmt4=\", false, function() {\n    return [\n        next_router__WEBPACK_IMPORTED_MODULE_3__.useRouter\n    ];\n});\n_c = Layout;\n/* harmony default export */ __webpack_exports__[\"default\"] = (Layout);\nvar _c;\n$RefreshReg$(_c, \"Layout\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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InNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZUNvbnRleHQsIHVzZVN0YXRlLHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IExpbmsgZnJvbSAnbmV4dC9saW5rJztcclxuaW1wb3J0IHsgdXNlUm91dGVyIH0gZnJvbSAnbmV4dC9yb3V0ZXInO1xyXG5pbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xyXG5pbXBvcnQgQXV0aENvbnRleHQgZnJvbSAnLi4vY29udGV4dC9BdXRoQ29udGV4dCc7IC8vdXN1YXJpb1xyXG5cclxuXHJcbmNvbnN0IExheW91dCA9ICh7IGNoaWxkcmVuIH0pID0+IHtcclxuICAgIGNvbnN0IHsgdXNlciB9ID0gdXNlQ29udGV4dChBdXRoQ29udGV4dCk7IC8vIHVzdWFyaW8gZGVzZGUgZWwgY29udGV4dG8gZGUgYXV0ZW50aWNhY2nDs25cclxuICAgIGNvbnN0IFttZW51T3Blbiwgc2V0TWVudU9wZW5dID0gdXNlU3RhdGUoZmFsc2UpO1xyXG4gICAgY29uc3QgW2Ryb3Bkb3duT3Blbiwgc2V0RHJvcGRvd25PcGVuXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuICAgIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpO1xyXG4gICAgY29uc3QgW3VzZXJOYW1lLCBzZXRVc2VyTmFtZV0gPSB1c2VTdGF0ZSgnJyk7XHJcblxyXG4gICAgY29uc3QgdG9nZ2xlTWVudSA9ICgpID0+IHtcclxuICAgICAgICBzZXRNZW51T3BlbighbWVudU9wZW4pO1xyXG4gICAgfTtcclxuICAgIGNvbnN0IHRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Rva2VuJyk7XHJcbiAgICBpZiAodG9rZW4pIHtcclxuICAgICAgY29uc3QgZGVjb2RlZCA9IGp3dC5kZWNvZGUodG9rZW4pO1xyXG4gICAgICBpZiAoZGVjb2RlZCkge1xyXG4gICAgICAgIHNldFVzZXJOYW1lKGRlY29kZWQubm9tYnJlKTsgLy8gQXN1bWllbmRvIHF1ZSBlbCBub21icmUgc2UgZ3VhcmRhIGVuIGVsIHRva2VuXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IHRvZ2dsZURyb3Bkb3duID0gKCkgPT4ge1xyXG4gICAgICAgIHNldERyb3Bkb3duT3BlbighZHJvcGRvd25PcGVuKTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgaGFuZGxlTG9nb3V0ID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGF3YWl0IGF4aW9zLnBvc3QoJy9hcGkvbG9nb3V0Jyk7XHJcbiAgICAgICAgICAgIHJvdXRlci5wdXNoKCcvJyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgYWwgY2VycmFyIHNlc2nDs246JywgZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICA8bmF2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuIGl0ZW1zLWNlbnRlciBiZy1ibHVlLTcwMCBwLTQgc2hhZG93LW1kXCI+XHJcbiAgICAgICAgICAgICAgICA8aW1nIFxyXG4gICAgICAgICAgICAgICAgICAgIHNyYz1cIi9pbWcvaW50dXIucG5nXCIgXHJcbiAgICAgICAgICAgICAgICAgICAgYWx0PVwibG9nb1wiIFxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJmbGV4IHNwYWNlLXgtOCB0ZXh0LXdoaXRlIG14LWF1dG9cIj5cclxuICAgICAgICAgICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxMaW5rIGhyZWY9XCIvaW5pY2lvXCIgY2xhc3NOYW1lPVwiaG92ZXI6dGV4dC1ibHVlLTMwMCB0cmFuc2l0aW9uIGR1cmF0aW9uLTMwMFwiPkluaWNpbzwvTGluaz5cclxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPVwicmVsYXRpdmVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17dG9nZ2xlRHJvcGRvd259XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlIGZvY3VzOm91dGxpbmUtbm9uZSBob3Zlcjp0ZXh0LWJsdWUtMzAwIHRyYW5zaXRpb24gZHVyYXRpb24tMzAwXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTWFudGVuaW1pZW50byA8c3BhbiBjbGFzc05hbWU9XCJtbC0yXCI+4pa8PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAge2Ryb3Bkb3duT3BlbiAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIHJpZ2h0LTAgbXQtMiB3LTQ4IGJnLXdoaXRlIHJvdW5kZWQtbWQgc2hhZG93LWxnIHB5LTIgei0xMFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxMaW5rIGhyZWY9XCIvcm9sZXNcIiBjbGFzc05hbWU9XCJibG9jayBweC00IHB5LTIgdGV4dC1ncmF5LTgwMCBob3ZlcjpiZy1ibHVlLTEwMCBob3Zlcjp0ZXh0LWJsdWUtNjAwIHRyYW5zaXRpb24gZHVyYXRpb24tMzAwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJvbGVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9MaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxMaW5rIGhyZWY9XCIvdXN1YXJpb3NcIiBjbGFzc05hbWU9XCJibG9jayBweC00IHB5LTIgdGV4dC1ncmF5LTgwMCBob3ZlcjpiZy1ibHVlLTEwMCBob3Zlcjp0ZXh0LWJsdWUtNjAwIHRyYW5zaXRpb24gZHVyYXRpb24tMzAwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFVzdWFyaW9zXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9MaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0b2dnbGVNZW51fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlIGZvY3VzOm91dGxpbmUtbm9uZSBob3Zlcjp0ZXh0LWJsdWUtMzAwIHRyYW5zaXRpb24gZHVyYXRpb24tMzAwXCJcclxuICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBNb3N0cmFyIGVsIG5vbWJyZSBkZWwgdXN1YXJpbywgbyAnVXN1YXJpbycgc2kgbm8gZXN0w6EgbG9ndWVhZG8gKi99XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHt1c2VyTmFtZSB8fCAnVXN1YXJpbyd9IDxzcGFuIGNsYXNzTmFtZT1cIm1sLTJcIj7ilrw8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAge21lbnVPcGVuICYmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSByaWdodC0wIG10LTIgdy00OCBiZy13aGl0ZSByb3VuZGVkLW1kIHNoYWRvdy1sZyBweS0yIHotMTBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxMaW5rIGhyZWY9XCIvcGVyZmlsXCIgY2xhc3NOYW1lPVwiYmxvY2sgcHgtNCBweS0yIHRleHQtZ3JheS04MDAgaG92ZXI6YmctYmx1ZS0xMDAgaG92ZXI6dGV4dC1ibHVlLTYwMCB0cmFuc2l0aW9uIGR1cmF0aW9uLTMwMFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBlcmZpbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9MaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZUxvZ291dH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJibG9jayB3LWZ1bGwgdGV4dC1sZWZ0IHB4LTQgcHktMiB0ZXh0LWdyYXktODAwIGhvdmVyOmJnLWJsdWUtMTAwIGhvdmVyOnRleHQtYmx1ZS02MDAgdHJhbnNpdGlvbiBkdXJhdGlvbi0zMDBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENlcnJhciBTZXNpw7NuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L25hdj5cclxuICAgICAgICAgICAgPG1haW4+e2NoaWxkcmVufTwvbWFpbj5cclxuICAgICAgICAgICAgPGZvb3RlciBjbGFzc05hbWU9XCJiZy1ncmF5LTIwMCBwLTQgdGV4dC1jZW50ZXJcIj7CqSAyMDI0IFR1IEVtcHJlc2E8L2Zvb3Rlcj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBMYXlvdXQ7XHJcbiJdLCJuYW1lcyI6WyJ1c2VDb250ZXh0IiwidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJMaW5rIiwidXNlUm91dGVyIiwiYXhpb3MiLCJBdXRoQ29udGV4dCIsIkxheW91dCIsImNoaWxkcmVuIiwidXNlciIsIm1lbnVPcGVuIiwic2V0TWVudU9wZW4iLCJkcm9wZG93bk9wZW4iLCJzZXREcm9wZG93bk9wZW4iLCJyb3V0ZXIiLCJ1c2VyTmFtZSIsInNldFVzZXJOYW1lIiwidG9nZ2xlTWVudSIsInRva2VuIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsImRlY29kZWQiLCJqd3QiLCJkZWNvZGUiLCJub21icmUiLCJ0b2dnbGVEcm9wZG93biIsImhhbmRsZUxvZ291dCIsImVycm9yIiwicG9zdCIsInB1c2giLCJjb25zb2xlIiwiZGl2IiwibmF2IiwiY2xhc3NOYW1lIiwiaW1nIiwic3JjIiwiYWx0IiwidWwiLCJsaSIsImhyZWYiLCJidXR0b24iLCJvbkNsaWNrIiwic3BhbiIsIm1haW4iLCJmb290ZXIiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/components/Layout.jsx\n"));

/***/ })

});