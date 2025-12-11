import { AuthController } from "./auth/controllers/auth.controller";
import { IAuthController } from "./auth/controllers/auth.controller.interface";
import { BlogController } from "./modules/blog/controllers/blog.controller";
import { IBlogController } from "./modules/blog/controllers/blog.controller.interface";
import { CategoryController } from "./modules/category/controllers/category.controller";
import { ICategoryController } from "./modules/category/controllers/category.controller.interface";
import { CommentController } from "./modules/comments/controllers/comment.controller";
import { ICommentController } from "./modules/comments/controllers/comment.controller.interface";
import { UserController } from "./modules/users/controllers/user.controller";
import { IUserController } from "./modules/users/controllers/user.controller.interface";
export class ControllerProvider {
    private static _userControllerInstance: UserController;
    private static _authControllerInstance: AuthController;
    private static _categoryControllerInstance: CategoryController
    private static _blogControllerInstance: BlogController;
    private static _commentControllerInstance: CommentController;

    static get userController(): IUserController {
        if (!this._userControllerInstance)
            this._userControllerInstance = new UserController();
        return this._userControllerInstance;
    }

    static get authController(): IAuthController {
        if (!this._authControllerInstance)
            this._authControllerInstance = new AuthController();
        return this._authControllerInstance;
    }

    static get categoryController(): ICategoryController {
        if (!this._categoryControllerInstance)
            this._categoryControllerInstance = new CategoryController();
        return this._categoryControllerInstance;
    }

    static get blogController(): IBlogController {
        if (!this._blogControllerInstance)
            this._blogControllerInstance = new BlogController();
        return this._blogControllerInstance;
    }
    static get commentController(): ICommentController {
        if (!this._commentControllerInstance)
            this._commentControllerInstance = new CommentController();
        return this._commentControllerInstance;
    }


}
