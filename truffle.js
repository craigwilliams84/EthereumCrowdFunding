module.exports = {
    build: {
        "index.html": "views/index.html",
        "projects.html": "views/projects.html",
        "createProject.html": "views/createProject.html",
        "projectDetails.html": "views/projectDetails.html",
        "css/bootstrap.css": "css/bootstrap.css",
        "css/angular-datepicker.css": "css/angular-datepicker.css",
        "app.js": [
            "js/vendor/lightwallet.js",
            "js/vendor/hooked-web3-provider.js",
            "js/app.js"
        ],
        "angular.js" :[
            "js/vendor/angular.js",
            "js/vendor/angular-route.js",
            "js/vendor/angular-datepicker.js"
        ],
        "jquery.js" :[
            "js/vendor/jquery.js",
        ],
        "bootstrap.js" :[
            "js/vendor/bootstrap.js",
        ],
        "ProjectService.js": "services/ProjectService.js",
        "AccountsService.js": "services/AccountsService.js",
        "ProjectListController.js": "controllers/ProjectListController.js",
        "MyProjectsController.js": "controllers/MyProjectsController.js",
        "CreateProjectController.js": "controllers/CreateProjectController.js",
        "ProjectDetailsController.js": "controllers/ProjectDetailsController.js"
    },
    rpc: {
        host: "localhost",
        port: 8545
    }
};
