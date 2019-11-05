<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" exclude-result-prefixes="xsl" version="2.0">
    <xsl:output method="html" encoding="UTF-8" indent="yes" omit-xml-declaration="yes"/>
    <xsl:template match="/query">
        <h1>
            <xsl:value-of select="@title"/>
        </h1>
        <table>
            <xsl:for-each select="parameter">
                <tr>
                    <td>
                        <xsl:value-of select="@title"/>
                    </td>
                    <td>
                        <xsl:choose>
                            <xsl:when test="@input='number'">
                                <input  id='{@id}' type='number'/>
                            </xsl:when>
                            <xsl:when test="@input='datepicker'">
                                <input  id='{@id}' type='date'/>
                            </xsl:when>
                            <xsl:when test="@input='dropdown'">
                                <select id='{@id}' source='{@source}'></select>
                            </xsl:when>
                            <xsl:otherwise></xsl:otherwise>
                        </xsl:choose>
                    </td>
                </tr>
            </xsl:for-each>
        </table>
    </xsl:template>
</xsl:stylesheet>
