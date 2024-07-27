const config = {
  screens: {

    Main: {
      path: '',
      screens: {
        TabNavigator: {
          path: '',
          screens: {
            Home: {
              path: 'post',
              screens: {
                ItemDetailScreen: {
                  // url: frontend-mobile://post/detail/${item.postid}
                  path: ':postID',
                  parse: {
                    postID: (postID: string) => `${postID}`,
                  },
                }
              }
            },
          },
        },
        MyProfile: 'profile',
        MyOrder: {
          path: 'order',
          screens: {
            ViewDetailOrder: {
              // url: frontend-mobile://order/detail/${orderid}
              path: ':orderid',
              parse: {
                orderid: (orderid: string) => `${orderid}`,
              },
            }
          }
        }
      },
    },
  }
};

const linking: any = {
  prefixes: ['frontend-mobile://'],
  config
}

export default linking;