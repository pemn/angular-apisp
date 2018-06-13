// js
/*
  Copyright 2017 Vale
 
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
 
  http://www.apache.org/licenses/LICENSE-2.0

  angular-apisp.js

  Angular $resource module wrapping the Microsoft Sharepoint REST API.
  Its a simpler alternative to full webAPI clients like Breeze and Swagger,
  with the added benefit of being relying on a built-in feature of Angular
  instead of some shifty module.
  
  v1.0 09/2017 paulo.ernesto
*/


(function() {
  'use strict';
  if (typeof angular === 'undefined') return;
  angular.module('ngApisp', ['ngResource']).service('apisp', function $apispProvider($resource) {
    var _host = document.location.origin;
    // extract the group prefix from the complete url
    var _group = document.location.pathname.substr(0,document.location.pathname.indexOf("/",8));
    // TODO: use angular config() phase to set this
    var _site = _host + _group;
    // from this part onward its OK to be hardcoded since its documented api paths
    _site += "/_api";
    var _paramDefaults = {listname: '@listname', id: '@id'};
    var _headers = { 'Accept'         : "application/json;odata=verbose",
                     'content-type'   : "application/json;odata=verbose"
    };
    
    var _actions = {
      'user'       : {method: 'GET' , headers: _headers, url: _host + "/_api/SP.UserProfiles.PeopleManager/GetMyProperties"},
      'getlist'    : {method: 'GET' , headers: _headers, url: _site + "/lists/getbytitle(':listname')"},
      'getitem'    : {method: 'GET' , headers: _headers, url: _site + "/lists/getbytitle(':listname')/items(:id)"},
      'postitem'   : {method: 'POST', headers: _headers, url: _site + "/lists/getbytitle(':listname')/items(:id)"},      
      'addfile'    : {method: 'POST', headers: _headers, url: _site + "/web/getfolderbyserverrelativeurl('" + _group + "/:listname')/files/add(url=':filename',overwrite=true)"},
      'savefile'   : {method: 'PUT' , headers: _headers, url: _site + "/web/getfilebyserverrelativeurl('" + _group + "/:listname/:filename')/$value"},
      'readfile'   : {method: 'GET' , headers: _headers, url: _site + "/web/getfilebyserverrelativeurl('" + _group + "/:listname/:filename')/$value"},
      'context'    : {method: 'POST', headers: _headers, url: _site + "/contextinfo"},
      'postlists'  : {method: 'POST', headers: _headers, url: _site + "/lists"},
      'postfields' : {method: 'POST', headers: _headers, url: _site + "/lists/getbytitle(':listname')/fields"},
      'getfields'  : {method: 'GET' , headers: _headers, url: _site + "/lists/getbytitle(':listname')/fields"}
    };

    var _proto = $resource(_site, _paramDefaults, _actions);
    _proto.fn_error = function(result) {
      console.log(result);
      window.alert(result.statusText);
    };

    // To save a List Item on sharepoint, we must supply the type
    // we recursively query the item type name for the requested list and
    // do the actual save with the correct metadata
    _proto.saveitem = function(params, postData, fn) {
      if(postData.hasOwnProperty('__metadata') && postData['__metadata'].hasOwnProperty('type')) {
        _proto.postitem(params, postData, fn, _proto.fn_error);
      } else {
        _proto.getlist(params, function(result){
          postData['__metadata'] = { 'type': result.d.ListItemEntityTypeFullName };
          _proto.postitem(params, postData, fn, _proto.fn_error);
        });
      }
    };

    _proto.lookupKeyValue = function(results, Key) {
      var Value = undefined;
      for(var i=0; i < results.length; i++) {
        if(results[i].Key == Key) {
          Value = results[i].Value;
        }
      }
      return(Value);
    };
    // initialize the context required for POST operations
    _proto.context({target: _site}, {}, function(result) {
      _headers["X-RequestDigest"] = result.d.GetContextWebInformation.FormDigestValue;
    });
    return _proto;
  });
})();
