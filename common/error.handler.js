module.exports = (object) => {
  console.log("--------------------");
  console.log("System Error", object);
  console.log("--------------------");

  if (object.name === "MongoError") {
    switch (object.code) {
      case 11000: {
        object.message = "You are not allow to enter duplicate record";
      }
    }
  }

  return {
    status: object.status || 500,
    message: object.message || "Something wrong happen on backend",
    error: object.error
  };
};
