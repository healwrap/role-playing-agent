import cors = require('@koa/cors');
import Koa from 'koa';
import logger from './utils/logger';
import path = require('path');
import * as dotenv from 'dotenv';
import { errorHandler } from './middleware/error/errorHandler';
import { httpLogger } from './middleware/error/httpLogger';
import { displayEnvironmentInfo, validateEnvironmentVariables } from './utils/env';
import { initializeDatabase } from './config/database';

// 验证环境变量
validateEnvironmentVariables();
displayEnvironmentInfo();


const app = new Koa();

// 初始化数据库
initializeDatabase().catch(error => {
  logger.error('Failed to initialize database:', error);
  process.exit(1);
});

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
