const {Router} = require("express")
const router = Router();
const multer = require("multer")
const Joi = require("@hapi/joi")
const path = require("path")
const checkLogin = require("../apps/middlewares/check-login")
const checkLevel = require("../apps/middlewares/check-level")
const checkLogout = require("../apps/middlewares/check-logout")

const upload = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, path.resolve("src", "storage"))
        },
        filename: function(req, file, cb) {
            cb(null, file.fieldname + "-" + Date.now())
        }
    })
})

const { AdminController, ProductController, CategoryController, UserController, ClientController, ChatController,  } = require("../apps/controllers");

router.route("/login").get(checkLogin, AdminController.login).post(checkLogin, AdminController.postLogin);
router.route("/signup").get(ClientController.signup).post(upload.single("user_img"),ClientController.store);
router.route("/verify").get(ClientController.verify).post(ClientController.check);
router.use("/", checkLogout)
router.get("/admin/logout", AdminController.logout)
router.use("/admin",checkLogout, checkLevel);


// For Admin
router.get("/admin/dashboard", AdminController.dashboard);

router.get("/admin/product", ProductController.manageproduct);
router.get("/admin/deleteproduct/:id", ProductController.destroy);

router.get("/admin/category", CategoryController.managecategory);
router.route("/admin/addcategory").get(CategoryController.addcategory).post(CategoryController.store);
router.route("/admin/editcategory/:id").get(CategoryController.editcategory).post(CategoryController.updateCategory);

router.get("/admin/user", UserController.manageuser);
router.get("/admin/deleteuser/:id", UserController.deleteuser);

// For Client

router.route("/addproduct").get(ClientController.addproduct).post(upload.single("prd_img"),ClientController.save);

router.get("/logout", ClientController.logout);
router.get("/home", ClientController.home);

router.get("/category-:id", ClientController.category);
router.get("/product-detail-:id", ClientController.productDetail);
router.get("/user-detail-:id", ClientController.userDetail);
router.get("/user-profile-:id", ClientController.userProfile);
router.route("/edit-user-:id").get(ClientController.editUser).post(upload.single("user_img"),ClientController.updateUser);
router.get("/delete-product-:id", ClientController.deleteProduct);
router.route("/edit-product-:id").get(ClientController.editProduct).post(upload.single("prd_img"),ClientController.updateProduct);
router.get("/search", ClientController.search);
router.get("/chat", ChatController.chat);

module.exports = router;