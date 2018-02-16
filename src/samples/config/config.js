const path = require('path')

const project_root = path.resolve(__dirname, '../../..')
const public_www_dir = path.join(project_root, 'dist/public/')
const public_css_dir = path.join(public_www_dir, 'css/')
const public_js_dir = path.join(public_www_dir, 'js/')
const server_js_dir = path.join(project_root, 'dist/')

module.exports = {
  public_www_dir,
  public_css_dir,
  public_js_dir,
  server_js_dir    
}

