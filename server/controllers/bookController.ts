import { RouterContext, helpers } from "https://deno.land/x/oak@v6.5.0/mod.ts";
import { Book } from "../models/Books.ts";

export const booksController = {
  async getAll(ctx: RouterContext) {
    const books = await Book.findAll();
    ctx.response.body = books;
  },

  async get(ctx: RouterContext) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    const book = await Book.findById(id);

    if (!book) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Not found" };
    } else {
      ctx.response.body = book;
    }
  },

  async create(ctx: RouterContext) {
    const result = ctx.request.body();
    const { title, author, price } = await result.value;
    const book = await Book.create({ title, author, price: Number(price) });
    await book.save();
    ctx.response.body = book;
  },
  async update(ctx: RouterContext) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    const book = await Book.findById(id);
    if (!book) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Not found" };
    } else {
      const result = ctx.request.body();
      const { title, author, price } = await result.value;
      await book.update({ title, author, price });
      ctx.response.body = book;
    }
  },
  async delete(ctx: RouterContext) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    await Book.delete(id);
    ctx.response.status = 204;
  },
};
