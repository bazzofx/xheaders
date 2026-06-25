import { Check, X, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface DeliveryInfoProps {
  dmarcCompliant: boolean
  spfAlignment: boolean
  spfAuthenticated: boolean
  dkimAlignment: boolean
  dkimAuthenticated: boolean
}

export default function DeliveryInfo({
  dmarcCompliant,
  spfAlignment,
  spfAuthenticated,
  dkimAlignment,
  dkimAuthenticated,
}: DeliveryInfoProps) {
  return (
    <div className="p-5 bg-slate-950/40 border border-slate-800/80 rounded-xl">
      <h2 className="text-lg font-semibold mb-4 text-slate-100 border-b border-slate-800/60 pb-2">Delivery Authentication Status</h2>

      <ul className="space-y-3">
        <li className="flex items-center">
          {dmarcCompliant ? (
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-950/50 border border-emerald-500/30 mr-3">
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            </span>
          ) : (
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-950/50 border border-red-500/30 mr-3">
              <X className="h-3.5 w-3.5 text-red-400" />
            </span>
          )}
          <span className="font-semibold text-slate-200">DMARC Compliant</span>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-2 text-cyan-400 hover:text-cyan-300 transition-colors p-0.5 rounded">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm bg-slate-900 border border-slate-800 text-slate-200">
                {dmarcCompliant ? (
                  <p>
                    SUCCESS: This email passes DMARC verification because either SPF or DKIM (or both) passed
                    authentication and alignment checks. DMARC requires at least one of these mechanisms to pass for
                    compliance.
                  </p>
                ) : (
                  <p>
                    FAILURE: This email fails DMARC verification because neither SPF nor DKIM passed both their
                    authentication and alignment checks. DMARC requires at least one of these mechanisms to pass for
                    compliance.
                  </p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </li>

        <li className="ml-6">
          <ul className="space-y-2.5 border-l border-slate-800/80 pl-4 mt-2">
            <li className="flex items-center">
              {spfAlignment ? (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-950/50 border border-emerald-500/20 mr-2.5">
                  <Check className="h-3 w-3 text-emerald-400" />
                </span>
              ) : (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-950/50 border border-red-500/20 mr-2.5">
                  <X className="h-3 w-3 text-red-400" />
                </span>
              )}
              <span className="text-slate-300 text-sm font-medium">SPF Alignment</span>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="ml-2 text-cyan-400 hover:text-cyan-300 transition-colors p-0.5 rounded">
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm bg-slate-900 border border-slate-800 text-slate-200">
                    {spfAlignment ? (
                      <p>
                        SUCCESS: The domain in the From header matches the domain in the Return-Path header. This means
                        the sender's identity is consistent, which is required for SPF alignment to pass.
                      </p>
                    ) : (
                      <p>
                        FAILURE: The domain in the From header does not match the domain in the Return-Path header. This
                        mismatch could indicate email forwarding or potential spoofing. SPF alignment requires these
                        domains to match.
                      </p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </li>

            <li className="flex items-center">
              {spfAuthenticated ? (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-950/50 border border-emerald-500/20 mr-2.5">
                  <Check className="h-3 w-3 text-emerald-400" />
                </span>
              ) : (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-950/50 border border-red-500/20 mr-2.5">
                  <X className="h-3 w-3 text-red-400" />
                </span>
              )}
              <span className="text-slate-300 text-sm font-medium">SPF Authenticated</span>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="ml-2 text-cyan-400 hover:text-cyan-300 transition-colors p-0.5 rounded">
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm bg-slate-900 border border-slate-800 text-slate-200">
                    {spfAuthenticated ? (
                      <p>
                        SUCCESS: The sending server's IP address is authorized to send emails for the domain specified
                        in the Return-Path. This means the email comes from a legitimate server for that domain.
                      </p>
                    ) : (
                      <p>
                        FAILURE: The sending server's IP address is not authorized to send emails for the domain
                        specified in the Return-Path. This could indicate spoofing or that the email was sent through an
                        unauthorized server.
                      </p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </li>

            <li className="flex items-center">
              {dkimAlignment ? (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-950/50 border border-emerald-500/20 mr-2.5">
                  <Check className="h-3 w-3 text-emerald-400" />
                </span>
              ) : (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-950/50 border border-red-500/20 mr-2.5">
                  <X className="h-3 w-3 text-red-400" />
                </span>
              )}
              <span className="text-slate-300 text-sm font-medium">DKIM Alignment</span>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="ml-2 text-cyan-400 hover:text-cyan-300 transition-colors p-0.5 rounded">
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm bg-slate-900 border border-slate-800 text-slate-200">
                    {dkimAlignment ? (
                      <p>
                        SUCCESS: The domain in the From header matches the domain in the DKIM signature (d= parameter).
                        This alignment can pass even if DKIM authentication fails, as it only checks domain consistency,
                        not signature validity.
                      </p>
                    ) : (
                      <p>
                        FAILURE: The domain in the From header does not match the domain in the DKIM signature. This
                        mismatch could indicate the email was forwarded or the sender is attempting to impersonate
                        another domain.
                      </p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </li>

            <li className="flex items-center">
              {dkimAuthenticated ? (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-950/50 border border-emerald-500/20 mr-2.5">
                  <Check className="h-3 w-3 text-emerald-400" />
                </span>
              ) : (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-950/50 border border-red-500/20 mr-2.5">
                  <X className="h-3 w-3 text-red-400" />
                </span>
              )}
              <span className="text-slate-300 text-sm font-medium">DKIM Authenticated</span>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="ml-2 text-cyan-400 hover:text-cyan-300 transition-colors p-0.5 rounded">
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm bg-slate-900 border border-slate-800 text-slate-200">
                    {dkimAuthenticated ? (
                      <p>
                        SUCCESS: The DKIM signature has been verified successfully. This confirms that the email content
                        has not been altered since it was signed by the sending domain, and the signature was created
                        with a valid private key.
                      </p>
                    ) : (
                      <p>
                        FAILURE: The DKIM signature could not be verified. This could be because the email was modified
                        in transit, the signature was created with an invalid key, or the email passed through multiple
                        mail servers that altered the content. Even with authentication failure, alignment can still
                        pass if the domains match.
                      </p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  )
}
