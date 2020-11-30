const AdminController = require("./admin");
const ProductController = require("./admin/manageproduct");
const CategoryController = require("./admin/managecategory");
const UserController = require("./admin/manageuser");
const ClientController = require("./client/index");
const ChatController = require("./chat")
module.exports = {
    AdminController,
    ProductController,
    CategoryController,
    UserController,
    ClientController,
    ChatController
};