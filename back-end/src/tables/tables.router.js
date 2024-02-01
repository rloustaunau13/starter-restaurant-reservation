/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./tables.controller");

router.route("/:table_id/seat").delete(controller.destroy).put(controller.put);

router.route("/").post(controller.create).get(controller.list);




module.exports = router;