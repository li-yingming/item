class Cart {
  constructor() {
    this.getCartGoods();
    //给.item_list 绑定点击事件,实现委托 
    this.$('.item_list').addEventListener('click', this.dispatch)
  }
  /*******事件委托的分发*****/
  dispatch = (eve) => {
    // console.log(this);
    //事件源的获取 
    let target = eve.target;
    // console.log(target);
    //判断当前点击的是删除a标签
    if (target.nodeName == 'A' && target.classList.contains('ops_a1')) this.delGoodsData(target)
  }
  //删除购物车中的商品,需要用户id,商品id 

  delGoodsData(tar) {
    // console.log(tar);
    //找到商品id
    // let id = tar.parentNode.parentNode.parentNode.parentNode.dataset.id;
    // console.log(id);
    //弹出框 询问是否删除 
    layer.confirm('是否确认删除商品', { title: '删除提示框' }, function () { //确认删除的回调函数
      // console.log(111);
      //给后台发送数据 删除记录
      let div = tar.parentNode.parentNode.parentNode.parentNode;
      let Gid = div.dataset.id;
      // 用户id
      let Uid = localStorage.getItem('user_id')
      // console.log(Gid, Uid);
      const AUTH_TOKEN = localStorage.getItem('token')
      axios.defaults.headers.common['authorization'] = AUTH_TOKEN;
      axios.get('http://localhost:8888/cart/remove', {
        params: { id: Uid, goodsId: Gid }
      }).then(res => {
        // console.log(res);
        //刷新删除 
        location.reload()
        // 无刷新删除
        // //关闭弹出框,且删除对应的div
        // layer.closeAll();
        // div.remove()
      })
    })

  }

  /***取出商品信息***/
  async getCartGoods() {
    //必须携带token后台需要验证 
    const AUTH_TOKEN = localStorage.getItem('token')
    axios.defaults.headers.common['authorization'] = AUTH_TOKEN;
    let { data, status } = await axios.get('http://localhost:8888/cart/list', {
      params: {
        id: localStorage.getItem('user_id')
      }
    })
    // console.log(res);
    //判断ajax的请求状态  
    if (status == 200 && data.code == 1) {
      // console.log(data.cart);
      let html = '';
      data.cart.forEach(goods => {
        // console.log(goods);
        html += ` 
        <div class="fl list_item" data-id="${goods.goods_id}">

        <div class="fl item_from">
          <div class="fl f_check">
            <div class="checks">
              <input type="checkbox" name="name_check" class="grandSon chk" />
            </div>
          </div>
          <div class="fl f_goods">
            <div class="fl goods_img">
              <a href="#"><img src="${goods.img_small_logo}" alt=""></a>
            </div>
            <div class="fl goods_p">
              <a href="#">
                <span>${goods.title}
                <span>Thunderbolt雷电接口至千兆以大网转</span>
              </a>
              <a href="#" class="p_gray"><i></i>购买礼品包装</a>
            </div>
          </div>
          <div class="fl f_props">
            <span>尺码: <i>Thunderbo1t至千兆...</i></span>
          </div>
          <div class="fl f_price"><i>${goods.current_price}</i></div>
          <div class="fl f_quantity">
            <div class="quantity">
              <button class="is-disabled"><i>-</i></button>
              <input class="cart-input-o" min="1" max="200" value="${goods.cart_number}">
                <button class="is-number"><i>+</i></button>
            </div>
            <p class="ac">有货</p>
          </div>
          <div class="fl f_sum">${goods.current_price * goods.cart_number}</span>
          <div class="fl f_ops">
            <a href="javascript:;" class="ops_a1">删除</a>
            <a href="javascript:;">移到我的关注</a>
          </div>
        </div>
    `
      });


      //将拼接好的字符串追加到页面中
      // console.log(html);
      this.$('.item_list').innerHTML += html;
    }
  }

  //封装获取节点的方法  
  $(tar) {
    let res = document.querySelectorAll(tar)
    return res.length == 1 ? res[0] : res;
  }
}
new Cart;