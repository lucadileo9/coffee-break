'use client';
import { motion, AnimatePresence } from "framer-motion";
import { Euro, Calculator, Banknote, Coins } from "lucide-react";
import React, { FC, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateChange, formatCurrency } from "@/lib/change-calculator";
import { CalculatorState } from "@/types/calculator-types";

import ChangeCalculatorProps from "./index.types"


const ChangeCalculator: FC<ChangeCalculatorProps> = ({ className }) => {
  const [state, setState] = useState<CalculatorState>({
    billTotal: "",
    cashReceived: "",
    changeDue: 0,
    breakdown: [],
    error: "",
  })

  const handleInputChange = (field: "billTotal" | "cashReceived", value: string) => {
    // Allow only numbers and decimal point
    const sanitizedValue = value.replace(/[^0-9.,]/g, "").replace(",", ".")

    setState((prev) => ({
      ...prev,
      [field]: sanitizedValue,
      error: "",
    }))
  }

  const handleCalculate = () => {
    const billTotal = Number.parseFloat(state.billTotal.replace(",", "."))
    const cashReceived = Number.parseFloat(state.cashReceived.replace(",", "."))

    // Validation
    if (isNaN(billTotal) || isNaN(cashReceived)) {
      setState((prev) => ({
        ...prev,
        error: "Inserisci importi validi",
      }))
      return
    }

    if (billTotal <= 0) {
      setState((prev) => ({
        ...prev,
        error: "Il totale deve essere maggiore di zero",
      }))
      return
    }

    if (cashReceived < billTotal) {
      setState((prev) => ({
        ...prev,
        error: "Il contante ricevuto è insufficiente",
      }))
      return
    }

    const changeDue = cashReceived - billTotal
    const breakdown = calculateChange(billTotal, cashReceived)

    setState((prev) => ({
      ...prev,
      changeDue,
      breakdown,
      error: "",
    }))
  }

  const handleReset = () => {
    setState({
      billTotal: "",
      cashReceived: "",
      changeDue: 0,
      breakdown: [],
      error: "",
    })
  }

  return (
    <div className={`min-h-screen bg-[#F5F5DC] p-4 ${className}`}>
      <div className="mx-auto max-w-md space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-[#6F4E37]">
            <Euro className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Coffee Break</h1>
          </div>
          <p className="text-[#6F4E37]/70 text-sm">Calcolatore di Resto</p>
        </motion.div>

        {/* Input Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-[#C4A484]/20 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-[#6F4E37]">
                <Calculator className="h-5 w-5" />
                Inserisci Importi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="billTotal" className="text-[#6F4E37] font-medium">
                  Totale Conto (€)
                </Label>
                <Input
                  id="billTotal"
                  type="text"
                  inputMode="decimal"
                  placeholder="0,00"
                  value={state.billTotal}
                  onChange={(e) => handleInputChange("billTotal", e.target.value)}
                  className="text-lg h-12 border-[#C4A484]/30 focus:border-[#C4A484] text-[#6F4E37]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cashReceived" className="text-[#6F4E37] font-medium">
                  Contante Ricevuto (€)
                </Label>
                <Input
                  id="cashReceived"
                  type="text"
                  inputMode="decimal"
                  placeholder="0,00"
                  value={state.cashReceived}
                  onChange={(e) => handleInputChange("cashReceived", e.target.value)}
                  className="text-lg h-12 border-[#C4A484]/30 focus:border-[#C4A484] text-[#6F4E37]"
                />
              </div>

              <AnimatePresence>
                {state.error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200"
                  >
                    {state.error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleCalculate}
                  className="flex-1 h-12 bg-[#C4A484] hover:bg-[#B8956F] text-white font-semibold"
                  disabled={!state.billTotal || !state.cashReceived}
                >
                  CALCOLA
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="px-6 h-12 border-[#C4A484] text-[#C4A484] hover:bg-[#C4A484]/10 bg-transparent"
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {state.breakdown.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Total Change */}
              <Card className="border-[#C4A484]/20 bg-white/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-[#6F4E37]/70 text-sm mb-1">Resto da Dare:</p>
                    <p className="text-3xl font-bold text-[#6F4E37]">{formatCurrency(state.changeDue)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Change Breakdown */}
              <Card className="border-[#C4A484]/20 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-[#6F4E37] text-lg">Dettaglio Resto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {state.breakdown.map((item, index) => (
                    <motion.div
                      key={`${item.denomination}-${item.type}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-3">
                        {item.type === "bill" ? (
                          <Banknote className="h-5 w-5 text-[#C4A484]" />
                        ) : (
                          <Coins className="h-5 w-5 text-[#C4A484]" />
                        )}
                        <span className="text-[#6F4E37] font-medium">
                          {formatCurrency(item.denomination)} {item.type === "bill" ? "Banconote" : "Monete"}
                        </span>
                      </div>
                      <span className="text-[#6F4E37] font-bold text-lg">{item.count}</span>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ChangeCalculator