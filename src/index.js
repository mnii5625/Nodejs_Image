const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();
const ImageResizeRoute = require('./routes/ImageResizeRoute');

router.get('/', (ctx) => {
    ctx.body = '안녕하세요. \n개발자 김민기의 Image Resize Server 입니다.';
})

app.use(async(ctx, next) => {
    try {
        await next();
    } catch (err) {
        if (err.message === 'is.not.image.type') {
            ctx.status = 415;
            ctx.body = {
                data: {},
                message: 'This format is not supported. The server only support jpg, jpeg, png, webp format.'

            };
        } else {
            ctx.status = 500;
            ctx.body = {
                code: 'internal.sever.error',
                data: {},
                message: 'Internal Server Error'
            };
        }
    }
})

app.use(router.routes()).use(router.allowedMethods());
app.use(ImageResizeRoute.routes()).use(ImageResizeRoute.allowedMethods());

app.listen(1000, () => {
    console.log('Storage Server is listening to port 1000');
})