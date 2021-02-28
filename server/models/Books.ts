import { db } from "../db.ts";
import { Bson } from "https://deno.land/x/mongo@v0.21.0/mod.ts";

interface BookSchema {
  _id: { $oid: string };
  title: string;
  author: string;
  price: number;
}

const booksCollection = db.collection<BookSchema>("books");

type Payload = Pick<BookSchema, "title" | "author" | "price">;

export class Book {
  private constructor(
    public title: string,
    public author: string,
    public price: number,
    public _id: object | undefined = undefined
  ) {}
  static async findAll() {
    const books = await booksCollection.find().toArray();
    return books.map((book) => {
      return new this(book.title, book.author, book.price, book._id);
    });
  }
  static async findById(id: string) {
    const book = await booksCollection.findOne({ _id: new Bson.ObjectId(id) });
    if (!book) return null;
    return new this(book.title, book.author, book.price, book._id);
  }

  static create({ title, author, price }: Payload) {
    return new this(title, author, price);
  }
  async save() {
    const _id = await booksCollection.insertOne({
      title: this.title,
      author: this.author,
      price: this.price,
    });
    this._id = _id;
  }
  async update({ title, author, price }: Payload) {
    await booksCollection.updateOne(
      { _id: this?._id },
      { $set: { title, author, price } }
    );
    this.title = title;
    this.author = author;
    this.price = price;
  }
  static delete(id: string) {
    booksCollection.deleteOne({ _id: new Bson.ObjectId(id) });
  }
}
