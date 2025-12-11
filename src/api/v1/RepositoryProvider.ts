import { IBlogRepository } from "./modules/blog/repositories/blog.repository.interface";
import { MongoBlogRepository } from "./modules/blog/repositories/mongoBlog.repository";
import { ICategoryRepository } from "./modules/category/repositories/category.repository.interface";
import { MongoCategoryRepository } from "./modules/category/repositories/MongoCategory.repository";
import { ICommentRepository } from "./modules/comments/repositories/comment.repository.interface";
import { CommentRepository } from "./modules/comments/repositories/MongoComment.repository";
import { UserPostgresRepository } from "./modules/users/repositories/postgresUser.repository";
import { IUserRepository } from "./modules/users/repositories/user.repository.interface";

export class RepositoryProvider {
    // private static _userRepositoryInstance: MongoUserRepository;
    private static _userRepositoryInstance: UserPostgresRepository;
    private static _categoryRepositoryInstance: MongoCategoryRepository;
    private static _blogRepositoryInstance: MongoBlogRepository;
    private static _commentRepositoryInstance: CommentRepository;

    static get userRepository(): IUserRepository {
        if (!this._userRepositoryInstance)
            this._userRepositoryInstance = new UserPostgresRepository();
        return this._userRepositoryInstance;
    }

    static get categoryRepository(): ICategoryRepository {
        if (!this._categoryRepositoryInstance)
            this._categoryRepositoryInstance = new MongoCategoryRepository();
        return this._categoryRepositoryInstance;
    }

    static get blogRepository(): IBlogRepository {
        if (!this._blogRepositoryInstance)
            this._blogRepositoryInstance = new MongoBlogRepository();
        return this._blogRepositoryInstance;
    }

    static get commentRepository(): ICommentRepository {
        if (!this._commentRepositoryInstance)
            this._commentRepositoryInstance = new CommentRepository();
        return this._commentRepositoryInstance;
    }


}
