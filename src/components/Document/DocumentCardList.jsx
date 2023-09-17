import { CircularProgress, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { DocumentCard } from './DocumentCard'

export const DocumentCardList = ({ documents, isLoading }) => {
  return (
    <Box>
      {isLoading
        ? <CircularProgress />
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
