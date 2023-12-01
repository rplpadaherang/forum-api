const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread', () => {
    it('should persist new thread and return added thread correctly', async () => {
      /**
       * TODO 4
       * Lengkapi pengujian fungsi `addThread` agar kita dapat
       * memastikan bahwa fungsi tersebut memasukkan data ke dalam database dengan benar.
       *
       * Pada pengujian ini, manfaatkanlah fungsi `ThreadsTableTestHelper.findThreadById`
       * untuk mengecek data `thread` yang ada di database berdasarkan id thread.
       */

      // Arrange
      // await UsersTableTestHelper.addUser({
      //   username: 'user-123',
      //   password: 'secret',
      // });
      // const newThread = {
      //   title: 'title',
      //   body: 'body',
      //   owner: 'user-123',
      // };

      //Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      const newThread = {
        title: 'this is new thread',
        body: 'this is thread body',
        owner: 'user-123',
      };

      const fakeIdGenerator = () => '123';
      const repository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await repository.addThread(newThread);

      //Assert
      expect(addedThread.id).toEqual('thread-123');
      expect(addedThread.title).toEqual(newThread.title);
      expect(addedThread.owner).toEqual(newThread.owner);

      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');

      expect(threads).toBeDefined();
      expect(threads.id).toEqual('thread-123');
      expect(threads.title).toEqual(newThread.title);
      expect(threads.owner).toEqual(newThread.owner);
      expect(threads.body).toEqual(newThread.body);
      expect(threads.date).toBeDefined();

    });
  });

  describe('isThreadExist', () => {
    it('should return true if thread exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const repository = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(repository.isThreadExist('thread-123')).resolves.toBe(true);
    });

    it('should return false if thread not exists', async () => {
      // Arrange
      const repository = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(repository.isThreadExist('thread-123')).resolves.toBe(false);
    });
  });

  describe('getThreadById', () => {
    it('should return null if thread not exists', async () => {
      // Arrange
      const repository = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await repository.getThreadById('thread-123');

      // Assert
      expect(thread).toBeNull();
    });

    it('should return thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const repository = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await repository.getThreadById('thread-123');

      // Assert
      expect(thread.id).toEqual('thread-123');
      expect(thread.title).toEqual('title');
      expect(thread.body).toEqual('body');
      expect(thread.date).toEqual(expect.any(String));
      expect(thread.username).toEqual('dicoding');
      expect(thread.comments).toEqual([]);
    });
  });
});
