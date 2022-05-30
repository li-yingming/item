class Login {
  constructor() {
    //给登录按钮绑定事件
    this.$('.over').addEventListener('click', this.islogin)
    //   console.log(location.search.split('='));
    //判断当前是否有会跳页面 
    let search = location.search;
    if (search) {
      this.url = search.split('=')[1]
    }
  }
  /**实现登录**/
  islogin = () => {
    // console.log(this);
    let form = document.forms[0].elements;
    // console.log(form);
    let username = form.user.value.trim();
    let password = form.password.value.trim();

    //非空验证
    if (!username || !password) throw new Error('用户名或密码不能为空')
    // console.log(username, password);
    //发送ajax请求,实现登陆 
    //当变量和属性名一致 直接写变量名
    //axios 默认以json的形式请求和编码参数
    let param = `username=${username}&password=${password}`
    axios.post('http://localhost:8888/users/login', param, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(res => {
      // console.log(res);
      //判断登录状态,将用户信息进行保存 
      if (res.status == 200 && res.data.code == 1) {
        //将token和user保存到local
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user_id', res.data.user.id);
        //如果有会跳的地址,则跳转
        if (this.url) {
          location.href = this.url;
        }

      }
    })

  }

  //封装获取节点的方法  
  $(tar) {
    let res = document.querySelectorAll(tar)
    return res.length == 1 ? res[0] : res;
  }
}
new Login;