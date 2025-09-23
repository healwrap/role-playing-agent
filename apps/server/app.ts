import cors = require('@koa/cors');
import * as Koa from 'koa';
import logger from './src/utils/logger';
import path = require('path');
import * as dotenv from 'dotenv';
import { errorHandler } from './src/middleware/error/errorHandler';
import { httpLogger } from './src/middleware/error/httpLogger';

// 根据环境加载不同的环境变量文件
if (process.env.NODE_ENV === 'production') {
  // 生产环境：环境变量通过 Docker 传入，不需要加载文件
  // eslint-disable-next-line no-console
  console.log('Running in production mode, using environment variables from Docker');
} else {
  // 开发环境：加载 .env.local 文件
  dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
}

const app = new Koa();

// 添加错误处理中间件（必须放在最前面）
app.use(errorHandler());

// 添加HTTP请求日志中间件
app.use(httpLogger());

// 配置 CORS
app.use(
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  })
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  // 服务启动成功
  const message = `server is running at http://localhost:${port}`;
  logger.info(message);
});
