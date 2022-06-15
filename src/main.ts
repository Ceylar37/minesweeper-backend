import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
async function bootstrap() {
  const PORT = process.env.PORT || 5000
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())
  app.enableCors({credentials: true, origin: "https://minesweeper-frontend-zeta.vercel.app/"});
  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}
bootstrap();
