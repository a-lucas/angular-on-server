/**
 * Created by antoine on 15/02/16.
 */

export default {
    appname: 'myApp',
    serverTimeout: 60000,
    views: {
        viewRoot: './../src/views',
        viewRegex: /\.html/i
    },
    api: {
        overrideClient: false, //if set to true, the AngularJS app will use the server-side REST caching strategy,
        storage: 'memory', //can use memory, redis, file, mixed
        routes: {
            'routeDefinition': {
                cache: 'false by default',
                destination: 'same by default'
            },
            '/products': {
                cache: {
                    use: true,
                    strategy: 'duration',
                    duration: 20
                },
                destination: {
                    local: true
                }
            },
            '/feeds': {
                cache: {
                    use: true,
                    strategy: 'duration',
                    duration: 20
                },
                destination: {
                    destination: 'http://whatevrUrl.com/feeds'
                }
            },
            '/dynamic/:id': {
                cache: {
                    use: true,
                    strategy: 'shouldUpdate',
                    duration: 20,
                    shouldUpdate: function(url, params) {
                        //
                    }
                },
                destination: {
                    destination: 'http://whatevrUrl.com/feeds'
                }

            }
        }
    }


}