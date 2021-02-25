# TODO

- [x] webpack dev 优化
- [ ] page title
- [ ] about, others page
- [ ] 404 page
- [ ] try esbuild or vite

# Usage

Via `git submodule`.

First install this theme.

```bash
$ git submodule add git@github.com:daief/hexo-theme-spa.git themes/spa
```

Update this theme.

```bash
# init submodule
$ git submodule init

# update submodules
$ git submodule update
```

Some git submodule commands.

```bash
# check current submodule status
$ git submodule status

# rm cache of submodules
$ git rm --cached themes/spa

```

# Note

- Should restart `hexo server` if update `_config.yml`

# Links

- Vue3 SSR: <https://stackoverflow.com/questions/64899690/vue-3-server-side-rendering-with-vuex-and-router>
