/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");

router.route("/").post(controller.create).get(controller.list).post(controller.create);



router.route("/:reservation_Id/status").put(controller.updateStatus);


router.route("/:reservation_Id").get(controller.read).put(controller.update);

module.exports = router;
