const Router = require('koa-router');
const sharp = require("sharp");
const API = require("../utils/API");

const router = new Router();

module.exports = router;

router.get('/images/:name', async (ctx) => {
    const { request, url } = ctx;
    const { query } = request;

    let format = query.f ?? 'webp'

    const imageTypes = ['png', 'jpg', 'jpeg', 'webp']

    if (!imageTypes.includes(format)) {
        throw new Error('is.not.image.type')
    }

    if (format === 'jpg') {
        format = 'jpeg';
    }

    const response = await API.async({"Content-Type": "image/webp"}, `http://storage.mingi.kr${url}`);

    let resizedImageFile = response.data;

    if (query.w && query.h) {
        resizedImageFile = await sharp(resizedImageFile)
            .resize(Number(query.w), Number(query.h), {fit: "fill"})
            .rotate(Number(query.r ?? 0))
            .toFormat(format)
            .withMetadata()
            .toBuffer();
    } else if (query.w) {
        resizedImageFile = await sharp(resizedImageFile)
            .resize({width: Number(query.w)})
            .rotate(Number(query.r ?? 0))
            .toFormat(format)
            .withMetadata()
            .toBuffer();
    } else if (query.h) {
        resizedImageFile = await sharp(resizedImageFile)
            .resize({height: Number(query.h)})
            .rotate(Number(query.r ?? 0))
            .toFormat(format)
            .withMetadata()
            .toBuffer();
    }

    ctx.set("Content-Type", `image/${format}`);
    ctx.body = resizedImageFile;
});