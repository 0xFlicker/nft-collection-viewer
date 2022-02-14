import { FC } from "react";
import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import type { IMetadataAttribute } from "../../types/metadata";

interface IProps {
  attributes: IMetadataAttribute[];
}

const Attributes: FC<IProps> = ({ attributes }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Type</TableCell>
          <TableCell align="right">Attribute</TableCell>
          <TableCell align="right">Percent</TableCell>
          <TableCell align="right">Rarity</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {attributes.map((attribute) => (
          <TableRow
            key={attribute.trait_type}
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
          >
            <TableCell component="th" scope="row">
              {attribute.trait_type}
            </TableCell>
            <TableCell align="right">{attribute.value}</TableCell>
            <TableCell align="right"></TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Attributes;
