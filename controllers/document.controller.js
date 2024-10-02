const catchAsync = require("../utils/controllerErrorHandler");
const fs = require("fs");
const csv = require("csv-parser");
const { bucketName } = require("../config");
const {
  uploadToAWS,
  getAllDocument,
  deleteToAWS,
} = require("../servies/aws.service");
const documentService = require("../servies/document.service");
const { PDFDocument, rgb } = require("pdf-lib");

const uploadFileController = catchAsync(async (req, res) => {
  try {
    const { id } = req.user;
    const { fileName } = req.body;
    const fileContent = fs.readFileSync(req.file.path);

    const params = {
      Bucket: bucketName,
      Key: `${id}/${fileName}`,
      Body: fileContent,
    };

    const fileData = await uploadToAWS(params);

    const docBody = {
      awsName: `${id}/${fileName}`,
      name: fileName,
      location: fileData.Location,
      key: fileData.key,
      tag: fileData.ETag,
      userId: id,
    };

    const document = await documentService.createDocument(docBody);

    return res.status(201).json({
      error: false,
      data: document,
      message: "File uploaded successfully",
    });
  } catch (error) {
    throw Error(error);
  }
});

const deleteFileController = catchAsync(async (req, res) => {
  try {
    const { docId } = req.params;

    const document = await documentService.findDocument({ id: docId });

    const params = {
      Bucket: bucketName,
      Key: document.key,
    };

    await deleteToAWS(params);

    await documentService.deleteDocument({ id: docId });

    return res
      .status(201)
      .json({ error: false, message: "File deleted successfully" });
  } catch (error) {
    throw Error(error);
  }
});

const updateFileController = catchAsync(async (req, res) => {
  try {
    const { docId } = req.params;

    let docBody = {
      isReportGenerated: false,
      reportAwsName: null,
      reportKey: null,
      reportLocation: null,
    };

    await documentService.updateDocument(docId, docBody);

    return res.status(201).json({
      error: false,
      message: "Report deleted successfully",
    });
  } catch (error) {
    throw Error(error);
  }
});

const fetchAllFilesController = catchAsync(async (req, res) => {
  try {
    const { id } = req.user;
    const limit = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    // const params = { Bucket: bucketName };
    // const fileData = await getAllDocument(params)
    const data = await documentService.findAllDocument({
      userId: id,
    });

    const fileData = await documentService.findAllPaginatedDocument(
      {
        userId: id,
      },
      limit,
      page
    );

    let pagination = {
      page: page,
      limit: limit,
      totalPage: Math.ceil(data?.length / limit),
      totalData: data?.length,
    };
    let totalDocument = data?.length;
    return res.status(201).json({
      error: false,
      data: fileData,
      pagination: pagination,
      message: "File fetched successfully",
    });
  } catch (error) {
    throw Error(error);
  }
});

const reportGenerateController = (req, res) => {
  const { id } = req.user;
  const docData = req.body;

  const records = [];
  let docBody;

  fs.createReadStream("./public/data.csv")
    .pipe(csv())
    .on("data", (row) => {
      records.push(row);
    })
    .on("end", async () => {
      try {
        const report = await generateReport(records, id, docData);
        const fileData = await uploadToAWS(report);

        docBody = {
          isReportGenerated: true,
          reportAwsName: `${docData.awsName}/report`,
          reportLocation: fileData.Location,
          reportKey: fileData.key,
        };

        document = await documentService.updateDocument(docData?.id, docBody);

        // Send the response inside the try block
        return res.status(201).json({
          error: false,
          data: docBody,
          message: "Report generated successfully!",
        });
      } catch (error) {
        console.error("Error uploading file to S3:", error);
        // Send an error response if something goes wrong
        return res.status(500).json({
          error: true,
          message: "Error generating the report.",
        });
      }
    });
};

const generateReport = async (records, id, docData) => {
  const departments = {};

  records.forEach((record) => {
    const department = record["CY Course"];
    const section = record["CY Section"];

    if (!departments[department]) {
      departments[department] = {
        sections: new Set(),
        academicallyBalanced: 0,
        behaviorallyBalanced: 0,
        students: 0,
        scheduled: 0,
        sectionsCount: 0,
      };
    }

    departments[department].students++;

    if (record["Academic Balance"]) {
      departments[department].academicallyBalanced++;
    }

    if (record["Behavioral Balance"]) {
      departments[department].behaviorallyBalanced++;
    }

    if (!departments[department].sections.has(section)) {
      departments[department].sections.add(section);
      departments[department].sectionsCount++;
    }
  });

  Object.values(departments).forEach((dept) => {
    dept.scheduled =
      dept.students > 0
        ? ((dept.academicallyBalanced / dept.students) * 100).toFixed(2) + "%"
        : "0%";
  });

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();

  Object.entries(departments).forEach(([department, data], index) => {
    let pdfContent = `${index + 1}\t${department}\t${data.sectionsCount}\t${
      data.academicallyBalanced
    } / ${data.sectionsCount}\t${data.behaviorallyBalanced} / ${
      data.sectionsCount
    }\t${data.students}\t${data.scheduled}`;

    page.drawText(pdfContent, {
      x: 50,
      y: 750 - index * 20, // Adjust the y-coordinate as needed
      color: rgb(0, 0, 0),
    });
  });

  let fileName = docData?.name;
  if (!fileName) {
    console.error("Error: File name is undefined.");
    return null; // or throw an error, depending on your error handling strategy
  }

  const pdfBytes = await pdfDoc.save();

  // Example: Save to a file
  fs.writeFileSync(fileName, pdfBytes);
  const pdfBuffer = Buffer.from(pdfBytes);

  const params = {
    Bucket: bucketName,
    Key: `${docData.awsName}/report`,
    Body: pdfBuffer,
    ContentType: "application/pdf",
  };
  return params;
};

module.exports = {
  uploadFileController,
  deleteFileController,
  updateFileController,
  fetchAllFilesController,
  reportGenerateController,
};
