/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./src/context/AuthContext.js":
/*!************************************!*\
  !*** ./src/context/AuthContext.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AuthProvider: () => (/* binding */ AuthProvider),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/router */ \"./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_3__);\n// context/AuthContext.js\n\n\n\n\nconst AuthContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)();\nconst SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || \"tu_clave_secreta\";\nconst AuthProvider = ({ children })=>{\n    const [user, setUser] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_3__.useRouter)();\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        const token = localStorage.getItem(\"token\");\n        if (token) {\n            try {\n                const decoded = jsonwebtoken__WEBPACK_IMPORTED_MODULE_2___default().verify(token, SECRET_KEY);\n                // Guardar todos los campos que necesitas en el estado del usuario\n                setUser({\n                    id: decoded.id,\n                    rol: decoded.rol,\n                    email: decoded.email,\n                    estado: decoded.estado,\n                    usuario: decoded.usuario // Asegúrate de que el campo 'usuario' esté presente en el token\n                });\n            } catch (error) {\n                localStorage.removeItem(\"token\");\n                setUser(null);\n            }\n        }\n    }, []);\n    const login = (token)=>{\n        localStorage.setItem(\"token\", token);\n        document.cookie = `token=${token}; path=/`; // Guarda el token en las cookies\n        const decoded = jsonwebtoken__WEBPACK_IMPORTED_MODULE_2___default().decode(token);\n        console.log(\"token decodificado en login es:\", decoded);\n        // Guardar todos los campos que necesitas en el estado del usuario\n        setUser({\n            id: decoded.id,\n            rol: decoded.rol,\n            email: decoded.email,\n            estado: decoded.estado,\n            usuario: decoded.usuario // Asegúrate de que el campo 'usuario' esté presente en el token\n        });\n    };\n    const logout = ()=>{\n        localStorage.removeItem(\"token\");\n        setUser(null);\n        router.push(\"/\");\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AuthContext.Provider, {\n        value: {\n            user,\n            login,\n            logout\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\context\\\\AuthContext.js\",\n        lineNumber: 57,\n        columnNumber: 9\n    }, undefined);\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AuthContext);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29udGV4dC9BdXRoQ29udGV4dC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEseUJBQXlCOztBQUVrQztBQUM1QjtBQUNTO0FBRXhDLE1BQU1LLDRCQUFjTCxvREFBYUE7QUFFakMsTUFBTU0sYUFBYUMsUUFBUUMsR0FBRyxDQUFDQyxzQkFBc0IsSUFBSTtBQUVsRCxNQUFNQyxlQUFlLENBQUMsRUFBRUMsUUFBUSxFQUFFO0lBQ3JDLE1BQU0sQ0FBQ0MsTUFBTUMsUUFBUSxHQUFHWiwrQ0FBUUEsQ0FBQztJQUNqQyxNQUFNYSxTQUFTVixzREFBU0E7SUFFeEJGLGdEQUFTQSxDQUFDO1FBQ04sTUFBTWEsUUFBUUMsYUFBYUMsT0FBTyxDQUFDO1FBQ25DLElBQUlGLE9BQU87WUFDUCxJQUFJO2dCQUNBLE1BQU1HLFVBQVVmLDBEQUFVLENBQUNZLE9BQU9UO2dCQUNsQyxrRUFBa0U7Z0JBQ2xFTyxRQUFRO29CQUNKTyxJQUFJRixRQUFRRSxFQUFFO29CQUNkQyxLQUFLSCxRQUFRRyxHQUFHO29CQUNoQkMsT0FBT0osUUFBUUksS0FBSztvQkFDcEJDLFFBQVFMLFFBQVFLLE1BQU07b0JBQ3RCQyxTQUFTTixRQUFRTSxPQUFPLENBQUMsZ0VBQWdFO2dCQUM3RjtZQUNKLEVBQUUsT0FBT0MsT0FBTztnQkFDWlQsYUFBYVUsVUFBVSxDQUFDO2dCQUN4QmIsUUFBUTtZQUNaO1FBQ0o7SUFDSixHQUFHLEVBQUU7SUFFTCxNQUFNYyxRQUFRLENBQUNaO1FBQ1hDLGFBQWFZLE9BQU8sQ0FBQyxTQUFTYjtRQUM5QmMsU0FBU0MsTUFBTSxHQUFHLENBQUMsTUFBTSxFQUFFZixNQUFNLFFBQVEsQ0FBQyxFQUFFLGlDQUFpQztRQUM3RSxNQUFNRyxVQUFVZiwwREFBVSxDQUFDWTtRQUMzQmlCLFFBQVFDLEdBQUcsQ0FBQyxtQ0FBbUNmO1FBQy9DLGtFQUFrRTtRQUNsRUwsUUFBUTtZQUNKTyxJQUFJRixRQUFRRSxFQUFFO1lBQ2RDLEtBQUtILFFBQVFHLEdBQUc7WUFDaEJDLE9BQU9KLFFBQVFJLEtBQUs7WUFDcEJDLFFBQVFMLFFBQVFLLE1BQU07WUFDdEJDLFNBQVNOLFFBQVFNLE9BQU8sQ0FBQyxnRUFBZ0U7UUFDN0Y7SUFDSjtJQUVBLE1BQU1VLFNBQVM7UUFDWGxCLGFBQWFVLFVBQVUsQ0FBQztRQUN4QmIsUUFBUTtRQUNSQyxPQUFPcUIsSUFBSSxDQUFDO0lBQ2hCO0lBRUEscUJBQ0ksOERBQUM5QixZQUFZK0IsUUFBUTtRQUFDQyxPQUFPO1lBQUV6QjtZQUFNZTtZQUFPTztRQUFPO2tCQUM5Q3ZCOzs7Ozs7QUFHYixFQUFFO0FBRUYsaUVBQWVOLFdBQVdBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9nZXN0aW9uLWFjYWRlbWljYS8uL3NyYy9jb250ZXh0L0F1dGhDb250ZXh0LmpzPzRiYTYiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gY29udGV4dC9BdXRoQ29udGV4dC5qc1xyXG5cclxuaW1wb3J0IHsgY3JlYXRlQ29udGV4dCwgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IGp3dCBmcm9tICdqc29ud2VidG9rZW4nO1xyXG5pbXBvcnQgeyB1c2VSb3V0ZXIgfSBmcm9tICduZXh0L3JvdXRlcic7XHJcblxyXG5jb25zdCBBdXRoQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbmNvbnN0IFNFQ1JFVF9LRVkgPSBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TRUNSRVRfS0VZIHx8ICd0dV9jbGF2ZV9zZWNyZXRhJztcclxuXHJcbmV4cG9ydCBjb25zdCBBdXRoUHJvdmlkZXIgPSAoeyBjaGlsZHJlbiB9KSA9PiB7XHJcbiAgICBjb25zdCBbdXNlciwgc2V0VXNlcl0gPSB1c2VTdGF0ZShudWxsKTtcclxuICAgIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpO1xyXG5cclxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgdG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9rZW4nKTtcclxuICAgICAgICBpZiAodG9rZW4pIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRlY29kZWQgPSBqd3QudmVyaWZ5KHRva2VuLCBTRUNSRVRfS0VZKTtcclxuICAgICAgICAgICAgICAgIC8vIEd1YXJkYXIgdG9kb3MgbG9zIGNhbXBvcyBxdWUgbmVjZXNpdGFzIGVuIGVsIGVzdGFkbyBkZWwgdXN1YXJpb1xyXG4gICAgICAgICAgICAgICAgc2V0VXNlcih7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGRlY29kZWQuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgcm9sOiBkZWNvZGVkLnJvbCwgLy8gQ2FtYmlhIGFxdcOtIGEgZGVjb2RlZC5yb2wgcGFyYSBvYnRlbmVyIGVsIFJPTFxyXG4gICAgICAgICAgICAgICAgICAgIGVtYWlsOiBkZWNvZGVkLmVtYWlsLFxyXG4gICAgICAgICAgICAgICAgICAgIGVzdGFkbzogZGVjb2RlZC5lc3RhZG8sXHJcbiAgICAgICAgICAgICAgICAgICAgdXN1YXJpbzogZGVjb2RlZC51c3VhcmlvIC8vIEFzZWfDunJhdGUgZGUgcXVlIGVsIGNhbXBvICd1c3VhcmlvJyBlc3TDqSBwcmVzZW50ZSBlbiBlbCB0b2tlblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgndG9rZW4nKTtcclxuICAgICAgICAgICAgICAgIHNldFVzZXIobnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LCBbXSk7XHJcblxyXG4gICAgY29uc3QgbG9naW4gPSAodG9rZW4pID0+IHtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndG9rZW4nLCB0b2tlbik7XHJcbiAgICAgICAgZG9jdW1lbnQuY29va2llID0gYHRva2VuPSR7dG9rZW59OyBwYXRoPS9gOyAvLyBHdWFyZGEgZWwgdG9rZW4gZW4gbGFzIGNvb2tpZXNcclxuICAgICAgICBjb25zdCBkZWNvZGVkID0gand0LmRlY29kZSh0b2tlbik7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3Rva2VuIGRlY29kaWZpY2FkbyBlbiBsb2dpbiBlczonLCBkZWNvZGVkKTtcclxuICAgICAgICAvLyBHdWFyZGFyIHRvZG9zIGxvcyBjYW1wb3MgcXVlIG5lY2VzaXRhcyBlbiBlbCBlc3RhZG8gZGVsIHVzdWFyaW9cclxuICAgICAgICBzZXRVc2VyKHtcclxuICAgICAgICAgICAgaWQ6IGRlY29kZWQuaWQsXHJcbiAgICAgICAgICAgIHJvbDogZGVjb2RlZC5yb2wsIC8vIENhbWJpYSBhcXXDrSBhIGRlY29kZWQucm9sIHBhcmEgb2J0ZW5lciBlbCBST0xcclxuICAgICAgICAgICAgZW1haWw6IGRlY29kZWQuZW1haWwsXHJcbiAgICAgICAgICAgIGVzdGFkbzogZGVjb2RlZC5lc3RhZG8sXHJcbiAgICAgICAgICAgIHVzdWFyaW86IGRlY29kZWQudXN1YXJpbyAvLyBBc2Vnw7pyYXRlIGRlIHF1ZSBlbCBjYW1wbyAndXN1YXJpbycgZXN0w6kgcHJlc2VudGUgZW4gZWwgdG9rZW5cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgbG9nb3V0ID0gKCkgPT4ge1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd0b2tlbicpO1xyXG4gICAgICAgIHNldFVzZXIobnVsbCk7XHJcbiAgICAgICAgcm91dGVyLnB1c2goJy8nKTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgICA8QXV0aENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3sgdXNlciwgbG9naW4sIGxvZ291dCB9fT5cclxuICAgICAgICAgICAge2NoaWxkcmVufVxyXG4gICAgICAgIDwvQXV0aENvbnRleHQuUHJvdmlkZXI+XHJcbiAgICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgQXV0aENvbnRleHQ7XHJcbiJdLCJuYW1lcyI6WyJjcmVhdGVDb250ZXh0IiwidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJqd3QiLCJ1c2VSb3V0ZXIiLCJBdXRoQ29udGV4dCIsIlNFQ1JFVF9LRVkiLCJwcm9jZXNzIiwiZW52IiwiTkVYVF9QVUJMSUNfU0VDUkVUX0tFWSIsIkF1dGhQcm92aWRlciIsImNoaWxkcmVuIiwidXNlciIsInNldFVzZXIiLCJyb3V0ZXIiLCJ0b2tlbiIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJkZWNvZGVkIiwidmVyaWZ5IiwiaWQiLCJyb2wiLCJlbWFpbCIsImVzdGFkbyIsInVzdWFyaW8iLCJlcnJvciIsInJlbW92ZUl0ZW0iLCJsb2dpbiIsInNldEl0ZW0iLCJkb2N1bWVudCIsImNvb2tpZSIsImRlY29kZSIsImNvbnNvbGUiLCJsb2ciLCJsb2dvdXQiLCJwdXNoIiwiUHJvdmlkZXIiLCJ2YWx1ZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/context/AuthContext.js\n");

/***/ }),

/***/ "./src/pages/_app.js":
/*!***************************!*\
  !*** ./src/pages/_app.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_global_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/global.css */ \"./src/styles/global.css\");\n/* harmony import */ var _styles_global_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_global_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _context_AuthContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../context/AuthContext */ \"./src/context/AuthContext.js\");\n// pages/_app.js\n\n\n\nfunction MyApp({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_context_AuthContext__WEBPACK_IMPORTED_MODULE_2__.AuthProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\pages\\\\_app.js\",\n            lineNumber: 9,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\cacer\\\\OneDrive\\\\Escritorio\\\\Proyecto\\\\src\\\\pages\\\\_app.js\",\n        lineNumber: 8,\n        columnNumber: 5\n    }, this);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvX2FwcC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxnQkFBZ0I7O0FBRWM7QUFDdUI7QUFFckQsU0FBU0MsTUFBTSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBRTtJQUNyQyxxQkFDRSw4REFBQ0gsOERBQVlBO2tCQUNYLDRFQUFDRTtZQUFXLEdBQUdDLFNBQVM7Ozs7Ozs7Ozs7O0FBRzlCO0FBRUEsaUVBQWVGLEtBQUtBLEVBQUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9nZXN0aW9uLWFjYWRlbWljYS8uL3NyYy9wYWdlcy9fYXBwLmpzPzhmZGEiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gcGFnZXMvX2FwcC5qc1xyXG5cclxuIGltcG9ydCAnLi4vc3R5bGVzL2dsb2JhbC5jc3MnXHJcbmltcG9ydCB7IEF1dGhQcm92aWRlciB9IGZyb20gJy4uL2NvbnRleHQvQXV0aENvbnRleHQnXHJcblxyXG5mdW5jdGlvbiBNeUFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPEF1dGhQcm92aWRlcj5cclxuICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxyXG4gICAgPC9BdXRoUHJvdmlkZXI+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTXlBcHBcclxuIl0sIm5hbWVzIjpbIkF1dGhQcm92aWRlciIsIk15QXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/pages/_app.js\n");

/***/ }),

/***/ "./src/styles/global.css":
/*!*******************************!*\
  !*** ./src/styles/global.css ***!
  \*******************************/
/***/ (() => {



/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = require("jsonwebtoken");

/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-dom");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("./src/pages/_app.js")));
module.exports = __webpack_exports__;

})();