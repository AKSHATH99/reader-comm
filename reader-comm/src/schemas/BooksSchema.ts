import {z} from 'zod';

export const BooksSchema = z.object({
    BookID: z.string().nonempty("Bookid is required"),
    BookName: z.string().nonempty("Bookid is required"),
    AuthorName: z.string().nonempty("Bookid is required"),
    PublishedDate:z.date(),
    Rating : z.number().nonnegative("Rating cannot be negative"),
    url:z.string().url(),

})