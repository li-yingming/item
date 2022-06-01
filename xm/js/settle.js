class Cart {
  constructor() {
    this.getCartGoods();
    //给.item_list 绑定点击事件,实现委托 
    this.$('.item_list').addEventListener('click', this.dispatch)
    //全选按钮点击事件 
    this.$('.checkAll').addEventListener('click', this.checkAll)
    //但选按钮事件绑定

  }
  /*******事件委托的分发*****/
  dispatch = (eve) => {
    // console.log(this);
    //事件源的获取 
    let target = eve.target;
    // console.log(target);
    //判断当前点击的是删除a标签
    if (target.nodeName == 'A' && target.classList.contains('ops_a1')) this.delGoodsData(target)
    //判断当前点击的是否为+ 操作 
    if (target.nodeName == 'A' && target.classList.contains('plus')) this.plusGoodsNum(target)
    //判断当前点击的是否为 - 操作
    if (target.nodeName == 'A' && target.classList.contains('reduce')) this.reduceGoodsNum(target)
  }
  //数量减的方法
  reduceGoodsNum = (tar) => {
    // console.log(tar);
    //获取数量的input 
    let ul = tar.parentNode.parentNode.parentNode.parentNode.parentNode
    // console.log(ul);
    //获取数量 单价  和小计
    let num = ul.querySelector('.cart-input-o')
    let sum = ul.querySelector('.sume');
    let price = ul.querySelector('.f_price i').innerHTML - 0;
    // console.log(num, sum, price);

    //获取数量 
    let numVal = num.value;
    // 对数量进行+1操作 
    numVal--
    // console.log(num);
    const AUTH_TOKEN = localStorage.getItem('token')
    axios.defaults.headers.common['authorization'] = AUTH_TOKEN;
    axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    //更新input中的数量,给服务器发送数据,增加和数量
    let Uid = localStorage.getItem('user_id');
    let Gid = ul.dataset.id;
    let param = `id=${Uid}&goodsId=${Gid}&number=${numVal}`
    axios.post('http://localhost:8888/cart/number', param).then(res => {
      // console.log(res);
      let { status, data } = res;
      if (status == 200 && data.code == 1) {
        //将更新之后的数量设置回去 
        num.value = numVal;
        sum.innerHTML = parseInt(numVal * price * 100) / 100;

        //调用统计数量和价格的方法
        this.countSumPrice()

      }
    })
  }
  /******数量增加的方法*******/
  plusGoodsNum = (tar) => {
    // console.log(tar);
    //获取数量的input 
    let ul = tar.parentNode.parentNode.parentNode.parentNode.parentNode
    // console.log(ul);
    //获取数量 单价  和小计
    let num = ul.querySelector('.cart-input-o')
    let sum = ul.querySelector('.sume');
    let price = ul.querySelector('.f_price i').innerHTML - 0;
    // console.log(num, sum, price);

    //获取数量 
    let numVal = num.value;
    // 对数量进行+1操作 
    numVal++
    // console.log(num);
    const AUTH_TOKEN = localStorage.getItem('token')
    axios.defaults.headers.common['authorization'] = AUTH_TOKEN;
    axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    //更新input中的数量,给服务器发送数据,增加和数量
    let Uid = localStorage.getItem('user_id');
    let Gid = ul.dataset.id;
    let param = `id=${Uid}&goodsId=${Gid}&number=${numVal}`
    axios.post('http://localhost:8888/cart/number', param).then(res => {
      // console.log(res);
      let { status, data } = res;
      if (status == 200 && data.code == 1) {
        //将更新之后的数量设置回去 
        num.value = numVal;
        sum.innerHTML = parseInt(numVal * price * 100) / 100;

        //调用统计数量和价格的方法
        this.countSumPrice()

      }
    })


  }
  /*****全选的实现******/
  checkAll = (eve) => {
    // console.log(this);
    //点击全选的时候应该让单个商品选中框状态跟随全选
    // console.log(eve.target);
    let allStatus = eve.target.checked;
    // console.log(allStatus);
    this.oneCheckGoods(allStatus)

    //调用统计数量和价格的方法
    this.countSumPrice()
  }
  //让单个商品跟随全选的状态
  oneCheckGoods(status) {
    // this.$('grandSon chk')
    // console.log(this.$('.grandSon-chk'));
    this.$('.grandSon-chk').forEach(input => {
      input.checked = status
    })

  }
  /*******单选的实现******/
  oneCheckGoodsBox() {
    //给每个单选按钮绑定点击事件 
    this.$('.grandSon-chk').forEach(input => {
      //保存this的指向
      let self = this;
      input.onclick = function () {
        //获取当前的点击状态
        // console.log(this.checked);
        //判断当前商品的input点击的是取消,则此时取消全选
        if (!this.checked) {
          self.$('.checkAll').checked = false;
        }
        //点击选中时则判断页面中是否有其他的未选中,如果都选中,则全选选中 
        if (this.checked) {
          let status = self.getOneGoodsStatus();
          // console.log(status);
          self.$('.checkAll').checked = status;
        }
        //统计价格和数量
        self.countSumPrice()
      }
    })
  }
  /***获取单个商品的选中状态***/
  getOneGoodsStatus() {
    //寻找是否有没选中的,如果页面都选中,res为空数组
    let res = Array.from(this.$('.grandSon-chk')).find(input => {
      // console.log(input.checked);
      return !input.checked
    })
    // console.log(res);
    //判断 如果res有值,则页面中有没被选中的 
    //页面中都被选中则返回t 
    return !res;
  }
  /********统计数量和价格********/
  countSumPrice() {
    let sum = 0;
    let num = 0;

    //只统计选中商品
    this.$('.grandSon-chk').forEach(input => {
      // console.log(input);
      // 通过input:checkbox 找到父级
      if (input.checked) {
        let ul = input.parentNode.parentNode.parentNode.parentNode
        // console.log(ul);

        //获取数量和小计计算
        let tmpNum = ul.querySelector('.cart-input-o').value - 0;
        // console.log(tmpNum);
        let tmpSum = ul.querySelector('.sume').innerHTML - 0;
        // console.log(tmpNum, tmpSum);
        sum += tmpSum;
        num += tmpNum;

      }

    })
    //保留小数点后2位 
    sum = parseInt(sum * 100) / 100
    // console.log(sum, num);
    //将数量和价格放到页面中 
    this.$('.all_em').innerHTML = num;
    this.$('.aa').innerHTML = sum
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
              <input type="checkbox" name="name_check" class="grandSon-chk" />
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
              <button class="is-disabled"> <a href="javascript:;" class="increment reduce">-</a></button>
              <input class="cart-input-o" min="1" max="200" value="${goods.cart_number}">
                <di class="is-number">  <a href="javascript:;" class="increment plus">+</a></di>
            </div>
            <p class="ac">有货</p>
          </div>
          <div class="fl f_sum"><span class="sume">${goods.current_price * goods.cart_number}</span>
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
      //单选按钮时间绑定
      this.oneCheckGoodsBox()
    }

    if (status == 200 && data.code == 401) {
      //清除local 中token 和 userID
      localStorage.removeItem('token')
      localStorage.removeItem('user_id')
      //跳转到登录页面
      location.assign('./login.html?ReturnUrl=./settle.html')

    }
  }


  //封装获取节点的方法  
  $(tar) {
    let res = document.querySelectorAll(tar)
    return res.length == 1 ? res[0] : res;
  }
}
new Cart;