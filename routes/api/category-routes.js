const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint
router.get("/", async (req, res) => {
  try {
    // find all categories
    const categoryData = await Category.findAll({
      // be sure to include its associated Products
      include: [{ model: Product }],
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    // find one category by its `id` value
    const categoryData = await Category.findByPk(req.params.id, {
      // be sure to include its associated Products
      include: [{ model: Product }],
    });

    if (!categoryData) {
      res.status(404).json({ message: "No category found with this id!" });
      return;
    }

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  // create a new category
  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/:id", async (req, res) => {
  // Get the old category name before the update
  try {
    // find it first so I can use dot notataion to retrieve its name
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      res.status(404).json("No category found with this id!");
      return;
    }
    // retrieve old name
    const oldCategoryName = category.category_name;
    // update the found id
    await category.update(
      {
        // All the fields you can update
        category_name: req.body.category_name,
      },
      {
        // Gets the category based on the id
        where: {
          id: req.params.id,
        },
      }
    );

    const responseMessage = ` ${oldCategoryName}  updated to  ${category.category_name}  successfully. `;
    console.log(responseMessage);
    res.status(200).json(responseMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  // delete a category by its `id` value
  try {
    // find it first so I can use dot notataion to retrieve its name
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      res.status(404).json("No category found with this id!");
      return;
    }
    // destory/delete the found id
    await category.destroy();

    const responseMessage = ` Category  ${category.category_name}  deleted successfully. `;
    console.log(responseMessage);
    res.status(200).json(responseMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
