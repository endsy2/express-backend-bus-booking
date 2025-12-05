import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllLayouts = async (req, res) => {
  try {
    const layouts = await prisma.busLayout.findMany();
    res.status(200).json({data: layouts});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch layouts" });
  }
};

export const getLayout = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    if(!id){
    return res.status(400).json({message:'input id'})
    }
    const layout = await prisma.busLayout.findUnique({ where: { id } });
    if (!layout) return res.status(404).json({ message: "Layout not found" });
    res.status(200).json({data: layout});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch layout" });
  }
};

export const createLayout = async (req, res) => {
  const { name, layout } = req.body;
  try {
      const newLayout = await prisma.busLayout.create({
      data: {
        name: name,         // optional
        layout: layout      // must be valid JSON
      }
    });
    console.log(newLayout); // will contain id
    res.status(200).json({data: newLayout});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create layout" });
  }
};

export const updateLayout = async (req, res) => {
  const id = parseInt(req.params.id);
  const { layout } = req.body;
  try {
    // Check if layout exists first
    const existingLayout = await prisma.busLayout.findUnique({ where: { id } });
    if (!existingLayout) return res.status(404).json({ message: "Layout not found" });

    const updatedLayout = await prisma.busLayout.update({
      where: { id },
      data: { layout },
    });
    res.status(200).json({data: updatedLayout});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update layout" });
  }
};

export const deleteLayout = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    // Check if layout exists first
    const existingLayout = await prisma.busLayout.findUnique({ where: { id } });
    if (!existingLayout) return res.status(404).json({ message: "Layout not found" });

    await prisma.busLayout.delete({ where: { id } });
    res.status(200).json({data: { message: "Layout deleted" }});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete layout" });
  }
};