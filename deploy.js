
var FtpDeploy = require("ftp-deploy");
var ftpDeploy = new FtpDeploy();

var config = {
  user: "digitalmenu",
  // Password optional, prompted if none given
  password: "MQlRIRxt7ffMSirU",
  host: "cp.stepweb.ru",
  port: 21,
  localRoot: __dirname + "/dist/dmenu",
  remoteRoot: "/",

  include: ["*", "**/*"],      // this would upload everything except dot files
  // include: ["*.php", "dist/*", ".*"],

  // e.g. exclude sourcemaps, and ALL files in node_modules (including dot files)
  exclude: ["dist/**/*.map", "node_modules/**", "node_modules/**/.*", ".git/**"],

  // delete ALL existing files at destination before uploading, if true
  deleteRemote: true,

  // Passive mode is forced (EPSV command is not sent)
  forcePasv: true,

  // use sftp or ftp
  sftp: false
};

ftpDeploy
  .deploy(config)
  .then(res => console.log("finished:", res))
  .catch(err => console.log(err));
