const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint
router.get("/", async (req, res) => {
  // find all tags
  try {
    const tagData = await Tag.findAll({
      // be sure to include its associated Product data
      include: [{ model: Product }],
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    // find a single tag by its `id`
    const tagData = await Tag.findByPk(req.params.id, {
      // be sure to include its associated Product data
      include: [{ model: Product }],
    });

    if (!tagData) {
      res.status(404).json({ message: "No tag found with this id!" });
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  // create a new tag
  try {
    const tagData = await Tag.create(req.body);
    res.status(200).json(tagData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/:id", async (req, res) => {
  // update a tag's name by its `id` value
  try {
    // Get the old tag name before the update
    // find it first so I can use dot notataion to retrieve its name
    const tag = await Tag.findByPk(req.params.id);

    if (!tag) {
      res.status(404).json("No category found with this id!");
      return;
    }
    // retrieve old name
    const oldTagName = tag.tag_name;
    // update the found id
    await tag.update(
      {
        // All the fields you can update
        tag_name: req.body.tag_name,
      },
      {
        // Gets the tag based on the id
        where: {
          id: req.params.id,
        },
      }
    );

    const responseMessage = ` ${oldTagName}  updated to  ${tag.tag_name}  successfully. `;
    console.log(responseMessage);
    res.status(200).json(responseMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  // delete on tag by its `id` value
  try {
    // find it first so I can use dot notataion to retrieve its name
    const tag = await Tag.findByPk(req.params.id);

    if (!tag) {
      res.status(404).json("No tag found with this id!");
      return;
    }
    // destory/delete the found id
    await tag.destroy();

    const responseMessage = ` Tag  ${tag.tag_name}  deleted successfully. `;
    console.log(responseMessage);
    res.status(200).json(responseMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
