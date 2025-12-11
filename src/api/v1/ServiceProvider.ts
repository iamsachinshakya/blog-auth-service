import { AuthService } from "./auth/services/auth.service";
import { IAuthService } from "./auth/services/auth.service.interface";
import { BlogService } from "./modules/blog/services/blog.service";
import { IBlogService } from "./modules/blog/services/blog.service.interface";
import { CategoryService } from "./modules/category/services/category.service";
import { ICategoryService } from "./modules/category/services/category.service.interface";
import { CommentService } from "./modules/comments/services/comment.service";
import { ICommentService } from "./modules/comments/services/comment.service.interface";
import { UserService } from "./modules/users/services/user.service";
import { IUserService } from "./modules/users/services/user.service.interface";

export class ServiceProvider {
    private static _authServiceInstance: AuthService;
    private static _userServiceInstance: UserService;
    private static _categoryServiceInstance: CategoryService;
    private static _blogServiceInstance: BlogService;
    private static _commentServiceInstance: CommentService

    static get authService(): IAuthService {
        if (!this._authServiceInstance)
            this._authServiceInstance = new AuthService();
        return this._authServiceInstance;
    }

    static get userService(): IUserService {
        if (!this._userServiceInstance)
            this._userServiceInstance = new UserService();
        return this._userServiceInstance;
    }

    static get categoryService(): ICategoryService {
        if (!this._categoryServiceInstance)
            this._categoryServiceInstance = new CategoryService();
        return this._categoryServiceInstance;
    }

    static get blogService(): IBlogService {
        if (!this._blogServiceInstance)
            this._blogServiceInstance = new BlogService();
        return this._blogServiceInstance;
    }

    static get commentService(): ICommentService {
        if (!this._commentServiceInstance)
            this._commentServiceInstance = new CommentService();
        return this._commentServiceInstance;
    }


}
