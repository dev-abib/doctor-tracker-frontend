import React from "react";
import {
  Stethoscope,
  Building2,
  Phone,
  Mail,
  Users,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Doctor } from "@/types/api";

interface Props {
  doctor: Doctor;
  onEdit?: () => void;
}

export const DoctorProfileCard: React.FC<Props> = ({ doctor }) => {
  return (
    <Card className="overflow-hidden border-border/80 bg-gradient-to-b from-card to-card/50 shadow-md">
      <div className="h-28 bg-gradient-to-r from-indigo-800 via-indigo-900 to-slate-900 relative" />
      <CardContent className="px-4 sm:px-6 pb-5 sm:pb-6 pt-0 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-10 sm:-mt-12 mb-4 sm:mb-5 gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 sm:gap-4">
            {doctor.image ? (
              <img
                src={doctor.image}
                alt={doctor.name}
                className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-2xl sm:rounded-3xl border-4 border-card object-cover shadow-xl"
              />
            ) : (
              <div className="flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-2xl sm:rounded-3xl border-4 border-card bg-primary text-primary-foreground shadow-xl text-2xl sm:text-3xl font-extrabold">
                {doctor.name.replace("Dr. ", "").charAt(0)}
              </div>
            )}
            <div className="mb-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-black text-foreground">
                  {doctor.name}
                </h2>
                <Badge variant="success" className="gap-1 text-[11px]">
                  <ShieldCheck className="h-3 w-3" />
                  Active
                </Badge>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-primary flex items-center gap-1.5 mt-0.5">
                <Stethoscope className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                <span>{doctor.specialization} Specialist</span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 pt-4 border-t border-border/60 text-xs">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/40 min-w-0">
            <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground">Affiliated Hospital</p>
              <p className="font-semibold text-foreground truncate">{doctor.hospital}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/40 min-w-0">
            <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground">Email Address</p>
              <p className="font-semibold text-foreground truncate">{doctor.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/40 min-w-0">
            <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground">Phone Number</p>
              <p className="font-semibold text-foreground truncate">{doctor.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/40 min-w-0">
            <Users className="h-4 w-4 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground">Total Patient Roster</p>
              <p className="font-bold text-foreground text-sm">
                {doctor.patientCount ?? 0} Patients
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
