/**
 * @author Till Hermsen
 * @date 02.11.12
 */

angular.module('BlogPostControllers', [
    'BlogPostServices',
    'CommentServices',
    'UserServices'
]).

    /**
     * BlogPostList Controller
     */
    controller('BlogPostListController', [
        '$scope',
        'BlogPostService',

        function($scope, BlogPostService) {
            $scope.blogPostService = BlogPostService;
        }
    ]).


    /**
     * BlogPost Controller
     */
    controller('BlogPostController', [
        '$scope',
        '$routeParams',
        'BlogPostService',
        'CommentService',

        function($scope, $routeParams, BlogPostService, CommentService) {
            $scope.blogPost = BlogPostService.blogPost;
            $scope.commentService = CommentService;
        }
    ]).


    /**
     * AddBlogPost Controller
     */
    controller('AddBlogPostController', [
        '$scope',
        '$location',
        'BlogPostService',
        'UserService',

        function($scope, $location, BlogPostService, UserService) {
            $scope.addBlogPostSubmit = function(blogPost) {
                var user = UserService.getUser();

                if (blogPost) {
                    blogPost.author = {};
                    blogPost.author.id = user.id || undefined;
                }

                BlogPostService.addBlogPost(blogPost).
                    success(function() {
                        $location.url('/');
                    });
            };
        }
    ]);