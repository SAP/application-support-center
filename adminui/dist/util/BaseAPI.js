sap.ui.define(["sap/ui/base/Object"],function(e){"use strict";return e.extend("asc.admin.util.BaseAPI",{_pendingRequests:{},_register:function(e,i){if(e&&e in this._pendingRequests){this._pendingRequests[e].abort();this._unregister(e)}this._pendingRequests[e]=i},_unregister:function(e){delete this._pendingRequests[e]},_requestComplete:function(e,i){if(e&&e in this._pendingRequests){this._unregister(e)}}})});