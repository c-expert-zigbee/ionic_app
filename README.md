Ionic App Base
=====================

A starting project for Ionic that optionally supports using custom SCSS.

## Using this project

We recommend using the [Ionic CLI](https://github.com/driftyco/ionic-cli) to create new Ionic projects that are based on this project but use a ready-made starter template.

For example, to start a new Ionic project with the default tabs interface, make sure the `ionic` utility is installed:

```bash
$ npm install -g ionic
```

Then run:

```bash
$ ionic start myProject tabs
```

More info on this can be found on the Ionic [Getting Started](http://ionicframework.com/getting-started) page and the [Ionic CLI](https://github.com/driftyco/ionic-cli) repo.

## Steps to run the app locally - ## 

1.Nodejs
	check if Nodejs is present using the below command
	 # node --version
	If node is not present install nodejs by this command on Linux or directly install the nodejs          and npm from the nodejs.org  
	 # sudo yum install nodejs npm

2.Bower 
	After installing the node, install Bower using npm
	 # npm install -g bower 
	To check if bower is installed or not hit this command
	 # bower --version

3. Ionic
   Install the ionic framework, 
 
```
#!bash

   # npm install -g cordova ionic
```

   To check if ionic is installed or not hit this command

```
#!python

	 # ionic --version
```

4. Follow the Android and iOS platform guides to install required platform dependencies.
Android - > http://cordova.apache.org/docs/en/5.1.1/guide/platforms/android/index.html
iOS ->  http://cordova.apache.org/docs/en/5.1.1/guide/platforms/ios/index.html 

Once these pre requisites are met run the app using following steps

1.Navigate to the project expatriate folder and install dependencies -

```
#!python

         # cd ~/app.expatriates.com
         # npm install
         # bower install
```

2.run the app using "ionic serve" command(to check in the browser)

3.run the app using “ionic run” command (to open in emulator)

4.run the app using “ionic serve -l” command (to open in ionic lab)