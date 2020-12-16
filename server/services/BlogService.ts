const BlogModel = require('../models/BlogModel.ts');
const db4 = require('../config/db.ts');
const UserModel3 = require('../models/UserModel.ts');
BlogModel.belongsTo(UserModel3, { foreignKey: 'email', targetKey: 'email' });

module.exports = {
    //删除博文
    deleteBlogById: async(blog_id) => {
        return await BlogModel.destory({
            where: {
                blog_id: blog_id
            }
        })
    },
    // 插入博文记录
    insertBlog: async (title, email, content) => {
        return await BlogModel.create({
            title: title,
            email: email,
            content: content,
        })
    },
    // 更新博客
    updateBlog: async (title, blog_id, content) => {
        return await BlogModel.update({
            title: title,
            content: content
        }, {
            where: {
                blog_id: blog_id
            }
        })
    },
    // 查找所有博文
    findBlogs: async () => {
        return await BlogModel.findAll({
            include: [{
                model: UserModel3,
                attributes: ['email', 'username', 'avatar']
            }]
        });
    },
    // 分页获取博文(按时间降序排列)
    findBlogsByPage: async (pageSize, currentPage) => {
        let offset = (currentPage - 1) * pageSize;
        return await BlogModel.findAll({
            offset,
            limit: pageSize,
            order: [['createdAt', 'DESC']],
            include: [{
                model: UserModel3,
                attributes: ['email', 'username', 'avatar']
            }]
        });
    },
    // 根据id查询博客
    findBlogById: async (blog_id) => {
        return await BlogModel.findAll({
            where: {
                blog_id: blog_id
            },
            order: [['createdAt', 'DESC']],
            include: [{
                model: UserModel3,
                attributes: ['email', 'username', 'avatar']
            }]
        })
    },
    // 根据关键字查询
    findBlogByKeyword: async (keyword) => {
        return await BlogModel.findAll({
            where: {
                [db4.Op.or]: [
                    {
                        title: {
                            [db4.Op.like]: '%' + keyword + '%'
                        }
                    },
                    {
                        content: {
                            [db4.Op.like]: '%' + keyword + '%'
                        }
                    }
                ]
            },
            order: [['createdAt', 'DESC']],
            include: [{
                model: UserModel3,
                attributes: ['email', 'username', 'avatar']
            }]
        })
    },
    // 根据email查询
    findBlogsByEmail: async (email) => {
        return await BlogModel.findAll({
            where: {
                email: email
            },
            order: [['createdAt', 'DESC']],
            include: [{
                model: UserModel3,
                attributes: ['email', 'username', 'avatar']
            }]
        })
    } 
}