import redis from "../config/redis.js";

export const registerSocketHandlers = (socket, io) => {
  /**
   * USER JOINS A SHOW ROOM
   */
  socket.on("join-show", async ({ showId }) => {
    socket.join(showId);
    socket.data.showId = showId;

    console.log(`✅ Socket ${socket.id} joined show ${showId}`);

    const lockedSeats = await redis.smembers(`locked-seats:${showId}`);

    const activeLockedSeats = [];

    for (const seatId of lockedSeats) {
      const lockKey = `seat-lock:${showId}:${seatId}`;
      const exists = await redis.exists(lockKey);

      if (exists) {
        activeLockedSeats.push(seatId);
      } else {
        await redis.srem(`locked-seats:${showId}`, seatId);
      }
    }

    socket.emit("locked-seats-initials", {
      seatIds: activeLockedSeats,
    });
  });

  /**
   * LOCK SEATS
   */
  socket.on("lock-seats", async ({ showId, seatIds, userId }, callback) => {
    if (!seatIds || !showId || !userId) {
      if (callback) callback({ success: false, message: "Missing data" });
      return;
    }

    const lockedSeatsKey = `locked-seats:${showId}`;
    const unavailableSeats = [];

    // Check if seats are already locked
    for (const seatId of seatIds) {
      const seatLockKey = `seat-lock:${showId}:${seatId}`;
      const existingLock = await redis.get(seatLockKey);

      if (existingLock && existingLock !== userId) {
        unavailableSeats.push(seatId);
      }
    }

    if (unavailableSeats.length > 0) {
      // Still emit to the client for the toast notification if needed
      socket.emit("seat-lock-failed", {
        showId,
        requested: seatIds,
        alreadyLocked: unavailableSeats,
      });
      if (callback) callback({ success: false, unavailableSeats });
      return;
    }

    // Lock seats
    for (const seatId of seatIds) {
      const seatLockKey = `seat-lock:${showId}:${seatId}`;

      // Store lock for 5 minutes
      await redis.setex(seatLockKey, 300, userId);

      // Add to locked set
      await redis.sadd(lockedSeatsKey, seatId);
    }

    io.to(showId).emit("seat-locked", {
      showId,
      seatIds,
      userId,
    });

    console.log(`✅ ${userId} locked seats:`, seatIds);
    if (callback) callback({ success: true });
  });

  /**
   * UNLOCK SEATS
   */
  socket.on("unlock-seats", async ({ showId, seatIds, userId }) => {
    if (!showId || !seatIds?.length) return;

    const lockedSeatsKey = `locked-seats:${showId}`;

    for (const seatId of seatIds) {
      const seatLockKey = `seat-lock:${showId}:${seatId}`;

      await redis.del(seatLockKey);
      await redis.srem(lockedSeatsKey, seatId);
    }

    io.to(showId).emit("seat-unlocked", {
      showId,
      seatIds,
      userId,
    });

    console.log(`🔓 ${userId} unlocked seats:`, seatIds);
  });

  /**
   * SOCKET DISCONNECT
   */
  socket.on("disconnect", () => {
    const showId = socket.data.showId;

    console.log(`❌ Socket ${socket.id} disconnected from show ${showId}`);
  });
};