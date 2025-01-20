import { Box, styled } from "@mui/material";
import { pdf } from "@react-pdf/renderer";
import { Btn } from "./InvoiceForm";
import PDFGenerator from "./PDFGenerator";
import DayIcon from "./svg-component/DayIcon";
import DownloadIcon from "./svg-component/DownloadIcon";
import NightIcon from "./svg-component/NightIcon";

interface ActivityProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  formik: any;
}

const ActivitySection: React.FC<ActivityProps> = ({
  isDarkMode,
  toggleDarkMode,
  formik,
}) => {
  const downloadPDF = async (formData: any) => {
    // Generate the PDF document
    const blob = await pdf(<PDFGenerator formData={formData} />).toBlob();

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Invoice_${formData.invoiceNumber || "new"}.pdf`;

    // Trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
  };

  return (
    <Activities>
      <Btn
        disableRipple
        onClick={async () => {
          // Trigger Formik validation
          const errors = await formik.validateForm();

          if (Object.keys(errors).length > 0) {
            formik.setTouched(
              {
                ...Object.keys(formik.values).reduce((acc: any, key) => {
                  acc[key] = true;
                  return acc;
                }, {}),
                items: formik.values.items.map(() => ({
                  description: true,
                })),
              },
              true
            );
            return;
          }

          // Proceed to download the PDF
          downloadPDF(formik.values);
        }}
        className={isDarkMode ? "light" : "dark"}
      >
        <DownloadIcon />
      </Btn>
      <Btn
        disableRipple
        onClick={toggleDarkMode}
        className={isDarkMode ? "dark" : "light"}
      >
        {isDarkMode ? <NightIcon /> : <DayIcon />}
      </Btn>
    </Activities>
  );
};

export default ActivitySection;

const Activities = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  position: "fixed",
  transform: "translate(-100%)",
  paddingRight: "1.25rem",
}));
