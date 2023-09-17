import { CircularProgress, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { DocumentCard } from './DocumentCard'

export const DocumentCardList = ({ documents, isLoading }) => {
  return (
    <Box>
      {isLoading
        ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography>Por gentileza, aguarde... </Typography>
            <CircularProgress />
          </div>
          )
        : documents?.length
          ? (
              documents.map((document) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                />
              ))
            )
          : (
            <Typography
              sx={{ mt: 16 }}
              align='center'
            >Ops! Nenhum DAS foi encontrado.
            </Typography>
            )}
    </Box>
  )
}
