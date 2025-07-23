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
  // Initial state for the calculator
  const [state, setState] = useState<CalculatorState>({
    billTotal: "", // Total bill amount
    cashReceived: "", // Cash received from the customer
    changeDue: 0, // Change to be returned to the customer
    breakdown: [], // Breakdown of the change in denominations
    error: "", // Error message if any validation fails
  })

  /**
   * Handles input changes for the specified field by sanitizing the input value.
   * Only numbers and decimal points are allowed; commas are converted to periods.
   * Updates the component state with the sanitized value and clears any error messages.
   *
   * @param field - The name of the field to update ("billTotal" or "cashReceived").
   * @param value - The input value to sanitize and set.
   */
  function handleInputChange(field: "billTotal" | "cashReceived", value: string) {
    // Allow only numbers and decimal point
    const sanitizedValue = value.replace(/[^0-9.,]/g, "").replace(",", ".");

    setState((prev) => ({
      ...prev,
      [field]: sanitizedValue, // Update the specific field with sanitized value
      error: "", // Clear any previous error message
    }));
  }

  /**
   * Calculates the change due based on the bill total and cash received from the current state.
   * Performs validation on the input values:
   * - Ensures both bill total and cash received are valid numbers.
   * - Ensures the bill total is greater than zero.
   * - Ensures the cash received is not less than the bill total.
   * If validation fails, sets an appropriate error message in the state.
   * If validation passes, computes the change due and its breakdown, and updates the state accordingly.
   */
  function handleCalculate() {
    const billTotal = Number.parseFloat(state.billTotal.replace(",", "."));
    const cashReceived = Number.parseFloat(state.cashReceived.replace(",", "."));

    // Check if inputs are valid numbers
    if (isNaN(billTotal) || isNaN(cashReceived)) {
      setState((prev) => ({
        ...prev,
        error: "Inserisci importi validi",
      }));
      return;
    }
    // check if bill total is greater than zero
    if (billTotal <= 0) {
      setState((prev) => ({
        ...prev,
        error: "Il totale deve essere maggiore di zero",
      }));
      return;
    }
    // check if cash received is less than bill total
    if (cashReceived < billTotal) {
      setState((prev) => ({
        ...prev,
        error: "Il contante ricevuto è insufficiente",
      }));
      return;
    }

    const changeDue = cashReceived - billTotal; // Calculate the change due
    const breakdown = calculateChange(billTotal, cashReceived); // Get the breakdown of change in denominations

    setState((prev) => ({
      ...prev,
      changeDue,
      breakdown,
      error: "",
    }));
  }

  /**
   * Resets the calculator state to its initial values.
   *
   * This function clears the bill total, cash received, change due,
   * breakdown of change, and any error messages.
   */
  function handleReset() {
    setState({
      billTotal: "",
      cashReceived: "",
      changeDue: 0,
      breakdown: [],
      error: "",
    });
  }

  return (
    <div className={`min-h-screen p-4 ${className}`}>
      <div className="mx-auto max-w-md space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Euro className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Coffee Break</h1>
          </div>
          <p className="text-sm">Calcolatore di Resto</p>
        </motion.div>

        {/* Input Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Inserisci Importi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="billTotal" className="font-medium">
                  Totale Conto (€)
                </Label>
                <Input
                  id="billTotal"
                  type="text"
                  inputMode="decimal"
                  placeholder="0,00"
                  value={state.billTotal}
                  onChange={(e) => handleInputChange("billTotal", e.target.value)}
                  className="text-lg h-12 bg-card-foreground/80 text-foreground placeholder:text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cashReceived" className="font-medium">
                  Contante Ricevuto (€)
                </Label>
                <Input
                  id="cashReceived"
                  type="text"
                  inputMode="decimal"
                  placeholder="0,00"
                  value={state.cashReceived}
                  onChange={(e) => handleInputChange("cashReceived", e.target.value)}
                  className="text-lg h-12 bg-card-foreground/80 text-foreground placeholder:text-foreground"
                />
              </div>

              <AnimatePresence>
                {state.error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm p-3 rounded-md"
                  >
                    {state.error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleCalculate}
                  className="flex-1 h-12 font-semibold"
                  disabled={!state.billTotal || !state.cashReceived}
                >
                  CALCOLA
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="px-6 h-12"
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
              <Card className="backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm mb-1">Resto da Dare:</p>
                    <p className="text-3xl font-bold">{formatCurrency(state.changeDue)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Change Breakdown */}
              <Card className="backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Dettaglio Resto</CardTitle>
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
                          <Banknote className="h-5 w-5" />
                        ) : (
                          <Coins className="h-5 w-5" />
                        )}
                        <span className="font-medium">
                          {formatCurrency(item.denomination)} {item.type === "bill" ? "Banconote" : "Monete"}
                        </span>
                      </div>
                      <span className="font-bold text-lg">{item.count}</span>
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