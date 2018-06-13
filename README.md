# angular-apisp
Angular $resource module wrapping the Microsoft Sharepoint REST API

## description  

Its a simpler alternative to full webAPI clients like Breeze and Swagger, with the added benefit of being relying on a built-in feature of Angular.  

## features  

 - Read and write Sharepoint lists.
 - Read user domain info.
 - Easily extensible and configurable to suit custom enviroments
 - No dependencies other than base Angular js.
 - Drop-in and drop-out replacement with any other REST api with a $resource wrapper.

## how to use  

Include the file *after* the angular libraries:  
`<script src="angular-apisp.js"></script>`
Then insert the dependency on your app, like any other angular module. The provider name is "ngApisp":
`var app = angular.module('app', ['ngApisp']);`
Now you can instantiate the service in your controller, again like any other service/provider:
`app.controller('MainCtrl', function ($scope, apisp){ ... }`  

## development status

Working.  
It was created to suit a specific use case, so may require some maintenance to work on enviroments with specific requirements.  
In particular, the group/site name detection code line may require atention:
`var _group = document.location.pathname.substr(0,document.location.pathname.indexOf("/",8));`

