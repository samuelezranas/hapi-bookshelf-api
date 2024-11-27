const { nanoid } = require('nanoid');
const books = require('./books');

/**
 * Handler to add new book
 * @param {*} request
 * @param {*} h
 * @returns {Object} response
 */
const addBookHandler = (request, h) => {
  try {
    const {
      name, year, author, summary, publisher, pageCount, readPage, reading,
    } = request.payload;

    if (typeof name === 'undefined') {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }

    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt,
    };

    books.push(newBook);

    const isSuccess = books.some((book) => book.id === id);

    if (isSuccess) {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      });
      response.code(201);
      return response;
    }

    const response = h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
  } catch (error) {
    console.error('Error:', error.message);
    const response = h.response({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
    });
    response.code(500);
    return response;
  }
};

/**
 * Handler to get all books
 * @param {*} request
 * @param {*} h
 * @returns {Object} response
 */
const getAllBooksHandler = (request, h) => {
  try {
    const { name, reading, finished } = request.query;

    // Start with all books
    let filteredBooks = books;

    // Filter by name (case insensitive)
    if (typeof name !== 'undefined') {
      filteredBooks = filteredBooks.filter((book) =>
        book.name.toLowerCase().includes(name.toLowerCase()));
    }

    // Filter by reading status
    if (typeof reading !== 'undefined') {
      const isReading = reading === '1'; // Convert 1 to true and 0 to false
      filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
    }

    // Filter by finished status
    if (typeof finished !== 'undefined') {
      const isFinished = finished === '1'; // Convert 1 to true and 0 to false
      filteredBooks = filteredBooks.filter((book) => book.finished === isFinished);
    }

    // Map the filtered books to the required response structure
    const response = h.response({
      status: 'success',
      data: {
        books: filteredBooks.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  } catch (error) {
    console.error(error); // Log error for debugging
    const response = h.response({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
    });
    response.code(500);
    return response;
  }
};

/**
 * Handler to get book by id
 * @param {*} request
 * @param {*} h
 * @returns {Object} response
 */
const getBookByIdHandler = (request, h) => {
  try {
    const { bookId } = request.params;

    const book = books.find((b) => b.id === bookId);

    if (book) {
      const response = h.response({
        status: 'success',
        data: {
          book,
        },
      });
      response.code(200);
      return response;
    }

    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  } catch (error) {
    console.error(error);
    const response = h.response({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
    });
    response.code(500);
    return response;
  }
};

/**
 * Handler to edit book by id
 * @param {*} request
 * @param {*} h
 * @returns {Object} response
 */
const editBookByIdHandler = (request, h) => {
  try {
    const { bookId } = request.params;

    const {
      name, year, author, summary, publisher, pageCount, readPage, reading,
    } = request.payload;

    if (typeof name === 'undefined') {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }

    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }

    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt: new Date().toISOString(),
      };

      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      });
      response.code(200);
      return response;
    }

    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  } catch (error) {
    console.error(error);
    const response = h.response({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
    });
    response.code(500);
    return response;
  }
};

/**
 * Handler to delete book by id
 * @param {*} request
 * @param {*} h
 * @returns {Object} response
 */
const deleteBookByIdHandler = (request, h) => {
  try {
    const { bookId } = request.params;

    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
      books.splice(index, 1);
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      });
      response.code(200);
      return response;
    }

    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  } catch (error) {
    console.error(error);
    const response = h.response({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
    });
    response.code(500);
    return response;
  }
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
