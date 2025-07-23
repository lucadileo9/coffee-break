'use client';
import { motion } from "framer-motion";
import { Euro } from "lucide-react";
import React, { FC } from "react";

import MyTitleProps from "./index.types"

const MyTitle: FC<MyTitleProps> = ({ title, subtitle }) => {
  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2 p-4">
      <div className="flex items-center justify-center gap-2">
        <Euro className="h-8 w-8" />
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      <p className="text-sm">{subtitle}</p>
    </motion.div>

  )
}
export default MyTitle